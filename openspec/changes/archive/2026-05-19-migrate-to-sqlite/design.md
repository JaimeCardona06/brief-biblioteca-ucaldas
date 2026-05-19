## Context

El sistema de préstamos bibliotecarios actual (v2) implementa Clean Architecture con repositorios en memoria. Los datos se pierden al reiniciar el servidor. Además, existe un bug donde las entidades convierten IDs a `Number()`, pero los códigos de inventario reales son strings alfanuméricos (ej. "LIB-001"), produciendo NaN.

La cliente indicó que eventualmente habrá presupuesto para BD, pero no podemos esperar. Se opta por SQLite por su simplicidad: no requiere servidor, cero configuración, y es perfecto para un MVP que luego puede migrarse a PostgreSQL/MySQL.

## Goals / Non-Goals

**Goals:**
- Persistencia de datos en SQLite (no más pérdida al reiniciar)
- Corrección del bug de IDs alfanuméricos en todas las entidades
- Mantener la arquitectura hexagonal actual (inyección de dependencias, capas separadas)
- Mínimo impacto en los servicios de aplicación y dominio
- Implementación sin ORM — SQL directo con `better-sqlite3`

**Non-Goals:**
- Migración de datos existentes en memoria (datos de prueba, se pierden)
- Soporte para múltiples motores de BD (no se abstrae con un ORM)
- API de paginación avanzada o búsqueda full-text
- Transacciones distribuidas o concurrencia avanzada

## Decisions

| Decisión | Opciones | Elegido | Razón |
|---|---|---|---|
| Driver SQLite | `sqlite3` (async) vs `better-sqlite3` (sync) | `better-sqlite3` | Síncrono, más simple, 5x más rápido, sin callbacks. La BD es local, no hay bloqueo de red que justifique async. |
|ORM vs SQL directo| Sequelize, Knex, SQL directo | SQL directo | No queremos capa de abstracción extra. Los repositorios ya aislan la BD. SQL directo es más predecible y fácil de auditar. |
| IDs auto-increment vs string | Entero auto vs string literal | String literal | Los códigos de inventario ya existen ("LIB-001", "EJ-001-01"). Generarlos como string mantiene compatibilidad con el sistema actual del cliente. |
| Inicialización de esquema | Migraciones manuales vs automáticas | Automática al arrancar `app.js` | El repositorio crea su tabla si no existe en el constructor. Simple, sin herramienta de migraciones. Para MVP es suficiente. |
| Ubicación del archivo BD | En `/data` vs raíz del proyecto | `./data/biblioteca.db` | Separado del código, fácil de incluir en `.gitignore` |

## Riesgos / Trade-offs

- [Riesgo] **Mezcla de responsabilidades**: Si el repositorio crea la tabla en el constructor, mezcla inicialización con lógica de datos. → Mitigación: la creación de tabla es idempotente (`CREATE TABLE IF NOT EXISTS`), es una operación de setup, no de negocio.
- [Riesgo] **Locking con `better-sqlite3`**: Al ser síncrono, una operación larga bloquea el event loop. → Mitigación: las operaciones de BD en este sistema son rápidas (consultas simples, pocos registros). Si escala, se puede migrar a `sqlite3` async.
- [Riesgo] **IDs strings como PK**: Las cadenas como PK son más lentas que enteros. → Mitigación: los volúmenes de datos de una biblioteca universitaria son pequeños (miles, no millones). No hay impacto medible.
- [Trade-off] **Datos de prueba perdidos**: Al migrar a SQLite, los datos en memoria se pierden. Habrá que crear un script de seed o endpoints para cargar datos.
