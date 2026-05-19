## Why

El sistema actual almacena todo en memoria (arrays dentro de repositorios), lo que significa que al reiniciar el servidor se pierden todos los datos. La cliente (Coordinadora de Biblioteca) indicó que "después montaremos base de datos cuando tengamos presupuesto", pero el sistema ya está en uso y la pérdida de datos es inaceptable. Además, existe un bug crítico de diseño: las entidades convierten IDs a `Number()`, pero los códigos de inventario reales son strings alfanuméricos (ej. "LIB-001", "EJ-001-01"), lo que produce NaN silenciosamente y rompe la lógica de préstamos.

## What Changes

- Migrar persistencia de memoria a SQLite usando `better-sqlite3`
- Corregir el casteo de IDs en todas las entidades del dominio (`Number(id)` → `String(id)`)
- Refactorizar los 6 repositorios para que implementen SQLite en lugar de arrays en memoria
- Mantener la inyección de dependencias actual en `app.js` (los repositorios siguen siendo intercambiables)
- Agregar inicialización de esquema SQLite al arrancar la aplicación
- **BREAKING**: Los IDs ahora serán strings en lugar de números. Clientes de la API que enviaban IDs numéricos deberán usar strings.

## Capabilities

### New Capabilities
- `sqlite-persistence`: Persistencia de datos en SQLite con migraciones automáticas al iniciar la aplicación
- `alfanumeric-ids`: Corrección del tipo de IDs en todas las entidades y repositorios para soportar códigos alfanuméricos

### Modified Capabilities

Ninguna. No hay capacidades previas documentadas en `openspec/specs/`.

## Impact

- **src/domain/entities/**: Modificar constructores de Book, Copy, Loan, Student, Fine, Solicitud para usar strings en IDs
- **src/infrastructure/repositories/**: Los 6 repositorios se reescriben para usar SQLite. Cambia la firma de `create()` para que el ID lo genere la BD (auto-increment) o lo reciba como string.
- **src/infrastructure/app.js**: Se agrega inicialización de la BD y se inyecta la dependencia `better-sqlite3` a los repositorios
- **Dependencias**: Se agrega `better-sqlite3` a `package.json`
- **Datos existentes en memoria**: Se pierden al migrar (esperado, son datos de prueba)
