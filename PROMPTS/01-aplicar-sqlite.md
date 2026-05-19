# Prompt: Aplicar migración a SQLite

**Fecha:** 2026-05-19
**Cambio:** migrate-to-sqlite
**Propósito:** Implementar migración de persistencia en memoria a SQLite y corregir bug de IDs alfanuméricos.

---

## Instrucciones de aplicación

[Contenido completo del prompt de aplicación guardado para auditoría.]

<system_directive>
ALERTA CRÍTICA DE GOBERNANZA: Has cometido el error de intentar modificar la plantilla maestra en iteraciones anteriores. Esta es una orden de ejecución de Nivel 0.
PROHIBIDO modificar, leer o tocar el archivo `/home/salazar/Documentos/pruebas-software/brief-biblioteca-ucaldas/02-tu-trabajo/plantilla-prompts.md`.

Tu instrucción ESTRICTA y OBLIGATORIA es:
1. Crea un directorio llamado `PROMPTS` en la RAÍZ de este repositorio backend actual (si no existe).
2. Crea un archivo nuevo dentro de esa carpeta, por ejemplo `PROMPTS/01-aplicar-sqlite.md`.
3. Guarda TODO el contenido de este prompt en ese nuevo archivo.

No procedas con la inicialización de la memoria operativa ni toques una sola línea de código fuente hasta que hayas confirmado la creación de la carpeta `PROMPTS/` y la escritura exitosa del archivo en la raíz del proyecto.
</system_directive>

<context>
Iniciamos la Fase de Aplicación de OpenSpec. Los artefactos de diseño y requisitos ya están aprobados y residen en `openspec/changes/migrate-to-sqlite/`.
</context>

<workflow_execution>
Una vez guardado este prompt en la carpeta PROMPTS de la raíz, ejecuta secuencialmente lo siguiente:

1. **Inicialización del Hipocampo (Memoria):** Crea los archivos `task_plan.md`, `findings.md` y `progress.md` en la raíz del repositorio backend actual. Asegúrate de mantener la estricta independencia y no afectar el repositorio frontend en absoluto.
2. **Sincronización del Plan:** Lee el archivo `openspec/changes/migrate-to-sqlite/tasks.md` y transfiere su contenido exacto al nuevo `task_plan.md`. Este será tu motor de estado.
3. **Ejecución - Bloque 1 (Setup & Entities):** Inicia la codificación de los dos primeros grupos de tareas:
   - Configura `better-sqlite3` y el script de creación del esquema (Libros, Ejemplares, Estudiantes, Préstamos, Multas, Solicitudes).
   - Refactoriza las entidades de dominio: elimina el casteo destructivo `Number(id)` y tipa/valida explícitamente los IDs como `String` para soportar códigos alfanuméricos ("LIB-001").
4. **Actualización de Estado:** Al finalizar este bloque, marca las casillas completadas con `[x]` en `task_plan.md`. Escribe un resumen de los comandos y archivos mutados en `progress.md`. Si la inyección de `better-sqlite3` generó algún conflicto técnico, documéntalo en `findings.md`.
5. **Pausa:** Detén la generación de código y solicita revisión humana antes de pasar a la refactorización de los repositorios.
</workflow_execution>