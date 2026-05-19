# Auditoría de Pruebas — Reglas de Negocio

**Fecha:** 2026-05-19
**API:** http://localhost:3001 (Clean Architecture + SQLite)
**Fuente:** `02-tu-trabajo/pruebas-reglas-negocio.md`

---

## Resultados

| Prueba | Regla | Esperado | Con IA — HTTP | Con IA — body util |
| :--- | :--- | :--- | :--- | :--- |
| RN1-B cuarto prestamo pregrado | RN1 | 409 | 409 | Si — "limite_prestamos_alcanzado" |
| RN2-B sexto prestamo posgrado | RN2 | 409 | 409 | Si — "limite_prestamos_alcanzado" |
| RN5-B ejemplar ya prestado | RN5 | 409 | 409 | Si — "ejemplar_no_disponible" |
| RN6-A plazo libro normal | RN6 | fecha + 15 dias | 2026-06-03 (+15d) | Si — fecha correcta |
| RN6-B plazo alta demanda | RN6 | fecha + 3 dias | 2026-05-22 (+3d) | Si — fecha correcta |
| RN3 prestamo con vencido | RN3 | 409 | 409 | Si — "bloqueado_por_multas_o_vencidos" |
| RN4-B prestamo con multa | RN4 | 409 | 409 | Si — "bloqueado_por_multas_o_vencidos" |
| RN8 calculo de multa | RN8 | N x 2000 | 488d × 2000 = 976,000 | Si — monto calculado |
| VAL-1 body vacio | — | 400 | 400 | Si — "student_id and copy_id required" |
| VAL-2 estudiante inexistente | — | 404 | 404 | Si — "student not found" |
| VAL-3 ejemplar inexistente | — | 404 | 404 | Si — "copy not found" |
| VAL-4 tipo incorrecto | — | 400 | 404 | No — busca estudiante con ID 12345 (inexistente) sin validar tipo primero |

---

## Hallazgos

### 1. VAL-4: tipos incorrectos retorna 404 en lugar de 400
**Severidad:** Media
**Detalle:** Enviar `student_id: 12345` (número en lugar de string) no valida el tipo de dato antes de buscar. El sistema intenta buscar y como no existe, retorna 404. Debería retornar 400 por tipo inválido.

### 2. Sistema no detecta préstamos vencidos automáticamente
**Severidad:** Alta
**Detalle:** Si se crea un préstamo con fecha en el pasado, el sistema lo guarda como `estado = 'activo'` aunque la fecha de devolución ya haya vencido. No hay un job/scheduler que marque préstamos como vencidos. RN3 solo funciona si el estado se marca manualmente como `'vencido'` en BD.

### 3. Discrepancia entre tests y API
**Severidad:** Informativa
**Detalle:** Los tests del archivo `pruebas-reglas-negocio.md` usan rutas con prefijo `/api/` y campos en español (`nombre`, `programa`, `titulo`, `autor`). La API real usa rutas sin prefijo y campos en inglés (`name`, `program_id`, `author`). Los curls fueron adaptados para la ejecución.

---

## Resumen

| Indicador | Valor |
|:---|---:|
| Pruebas ejecutadas | 12 |
| Pruebas pasan (HTTP correcto) | 11 |
| Pruebas fallan (HTTP incorrecto) | 1 (VAL-4) |
| Body util informativo | 11/12 |
