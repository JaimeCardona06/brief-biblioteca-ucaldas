# Findings — migrate-to-sqlite

## Registro de hallazgos durante implementación

| Fecha | Hallazgo | Tipo | Archivo afectado | Estado |
|---|---|---|---|---|
| 2026-05-19 | Repos in-memory tienen `Number(id)` en comparaciones (findById, findByStudent, sumUnpaidByStudent, etc.). Con IDs ahora como strings, `Number("LIB-001")` = NaN, rompiendo todas las búsquedas. Los repos serán refactorizados a SQLite en Bloque 3. | Breaking | `src/infrastructure/repositories/*.js` | Pendiente de resolución en Bloque 3 |
