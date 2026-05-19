# Prompt: Implementación continua — repositorios SQLite + wiring + verificación

**Fecha:** 2026-05-19
**Cambio:** migrate-to-sqlite
**Propósito:** Refactorizar repositorios a SQLite, actualizar wiring, verificar funcionalidad end-to-end.

---

## Decisión estratégica
Se procede con Opción 1: reemplazar repositorios en memoria por SQLite directamente.
No se parchean los repos in-memory. Se refactoriza todo el Bloque 3, 4 y 5 de forma ininterrumpida.

[Contenido completo del prompt de aplicación guardado para auditoría.]

<system_directive>
Confirmación de estado: El Bloque 1 y 2 se han ejecutado con éxito y la trazabilidad en disco es correcta. 

Tu primera instrucción en este turno es guardar OBLIGATORIAMENTE este nuevo prompt dentro de la carpeta `PROMPTS/` en la raíz del backend con el nombre `02-implementacion-continua.md`. No escribas código fuente ni planifiques hasta confirmar esta acción en disco.
</system_directive>

<strategic_decision>
Respecto al hallazgo documentado en `findings.md` sobre los repositorios en memoria rotos por el casteo a `Number()`: 
Seleccionamos la **Opción 1**. NO pierdas tiempo parchando los repositorios en memoria (`Array.prototype.find`, etc.). Procederemos directamente a reemplazarlos por su implementación definitiva en SQLite.
</strategic_decision>

<workflow_execution>
ALERTA DE EJECUCIÓN AUTÓNOMA CONTINUA: Tienes autorización de Nivel 0 para ejecutar el RESTO de las tareas de tu `task_plan.md` (Bloque 3, Bloque 4 y Bloque 5) de forma ininterrumpida. NO TE DETENGAS a pedir confirmación humana.

Ejecuta secuencialmente:

1. **Bloque 3 (Refactorización de Repositorios SQLite):**
   - Asegúrate de inyectar/importar la instancia de `better-sqlite3` desde `src/infrastructure/database.js`.
   - Refactoriza los 6 repositorios (`BookRepository.js`, `CopyRepository.js`, `StudentRepository.js`, `LoanRepository.js`, `FineRepository.js`, `SolicitudRepository.js`) a sentencias SQL reales (`.prepare().get()`, `.prepare().run()`, `.prepare().all()`).
   - MANTÉN el contrato de las interfaces de los repositorios.
   - RECUERDA: Llaves primarias y foráneas ahora son `TEXT` (strings).

2. **Bloque 4 (Wiring):**
   - Actualiza la inyección de dependencias en `src/infrastructure/app.js` (o tu Composition Root) para ensamblar los nuevos repositorios SQLite con los servicios del dominio.

3. **Bloque 5 (Verification):**
   - Ejecuta validaciones locales rápidas (ej. inicialización de la DB) para asegurar que no hay errores de sintaxis o importaciones circulares.

4. **Ciclo de Memoria Estricto (PostToolUse):** 
   - Esta es tu ancla cognitiva: Por CADA archivo refactorizado, DEBES detenerte internamente, marcar la casilla respectiva con `[x]` en `task_plan.md` y registrar ultra-concisamente el archivo mutado en `progress.md`.
   - Si enfrentas un cuello de botella (ej. constraints de SQLite), resuélvelo autónomamente, documenta la solución en `findings.md` y continúa. No te detengas.

5. **Finalización:** Detén tu ejecución ÚNICAMENTE cuando todas las casillas de `task_plan.md` estén marcadas como completadas y el backend esté funcional con SQLite.
</workflow_execution>
