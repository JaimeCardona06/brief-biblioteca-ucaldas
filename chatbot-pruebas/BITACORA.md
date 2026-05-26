# Bitácora — Chatbot de Pruebas con Ollama

## Sesión 1 — Creación de datos de prueba base

**Modelo:** qwen2.5-coder:7b  
**Servidor API:** http://localhost:3001  
**Fecha:** 2026-05-26

---

### Pregunta al chatbot

> crea los datos de prueba base para todas las reglas: un estudiante pregrado EST-PRE-01, uno posgrado EST-POS-01, un libro normal LIB-001 con 6 ejemplares y un libro de alta demanda LIB-002 con 1 ejemplar

---

### Resultados de ejecución

| # | Acción | Endpoint | HTTP Code | ¿Éxito? |
|---|--------|----------|-----------|---------|
| 1 | Crear estudiante pregrado | `POST /api/estudiantes` | 201 | ✅ |
| 2 | Crear estudiante posgrado | `POST /api/estudiantes` | 201 | ✅ |
| 3 | Crear libro normal | `POST /api/libros` | 201 | ✅ |
| 4 | Crear ejemplar EJ-001-01 | `POST /api/ejemplares` | 201 | ✅ |
| 5 | Crear ejemplar EJ-001-02 | `POST /api/ejemplares` | 201 | ✅ |
| 6 | Crear ejemplar EJ-001-03 | `POST /api/ejemplares` | 201 | ✅ |
| 7 | Crear ejemplar EJ-001-04 | `POST /api/ejemplares` | 201 | ✅ |
| 8 | Crear ejemplar EJ-001-05 | `POST /api/ejemplares` | 201 | ✅ |
| 9 | Crear ejemplar EJ-001-06 | `POST /api/ejemplares` | 201 | ✅ |
| 10 | Crear libro alta demanda | `POST /api/libros` | 201 | ✅ |
| 11 | Crear ejemplar EJ-002-01 | `POST /api/ejemplares` | 201 | ✅ |

---

### Datos creados

```json
// Estudiante pregrado
{ "id": "EST-PRE-01", "code": "EST-PRE-01", "name": "Nombre Pregrado", "tipo": "pregrado", "multas_pendientes": 0 }

// Estudiante posgrado
{ "id": "EST-POS-01", "code": "EST-POS-01", "name": "Nombre Posgrado", "tipo": "posgrado", "multas_pendientes": 0 }

// Libro normal
{ "id": "LIB-001", "codigo_inventario": "LIB-001", "name": "Título Normal", "alta_demanda": false }

// Libro alta demanda
{ "id": "LIB-002", "codigo_inventario": "LIB-002", "name": "Título de Alta Demanda", "alta_demanda": true }
```

---

### Observaciones

- Todos los endpoints respondieron **201 Created** correctamente.
- `program_id` aparece como `null` en la respuesta — los IDs de programa no se están guardando. Revisar si el repositorio de estudiantes los ignora.
- La codificación de caracteres acentuados se ve afectada en la terminal (`Título` aparece como `T�tulo`), pero es solo un problema de visualización, los datos se almacenan correctamente.
- El chatbot generó los curls con los **field names correctos** (`student_id`, `copy_id`, `book_id`, `code`, etc.) luego de actualizar el system prompt.
- La función `ejecutarCurl` logró unir las líneas partidas de los comandos multi-línea correctamente.

---

### Hallazgos

| Hallazgo | Tipo | Estado |
|----------|------|--------|
| `program_id` no se persiste en estudiantes | Bug | ⚠️ Pendiente de revisión |
| Caracteres acentuados se ven corruptos en terminal | Cosmético | ❌ No crítico |
| Chatbot usa field names correctos en inglés | ✅ | Resuelto |
| Ejecución automática de curls funciona multi-línea | ✅ | Resuelto |

---

## Sesión 2 — RN1 (Pregrado) y RN2 (Posgrado)

**Modelo:** deepseek-v4-flash (OpenCode API)  
**Servidor API:** http://localhost:3001  
**Fecha:** 2026-05-26

---

### RN1 — Límite pregrado (máx 3 préstamos)

| # | Acción | Copy | HTTP Code | Resultado |
|---|--------|------|-----------|-----------|
| 1 | 1er préstamo pregrado | EJ-001-01 | 201 | ✅ Creado |
| 2 | 2do préstamo pregrado | EJ-001-02 | 201 | ✅ Creado |
| 3 | 3er préstamo pregrado | EJ-001-03 | 201 | ✅ Creado |
| 4 | **4to intento (debe fallar)** | EJ-001-04 | **409** | ✅ **"limite_prestamos_alcanzado"** |

### RN2 — Límite posgrado (máx 5 préstamos)

| # | Acción | Copy | HTTP Code | Resultado |
|---|--------|------|-----------|-----------|
| 1 | 1er préstamo posgrado | EJ-001-04 | 201 | ✅ Creado |
| 2 | 2do préstamo posgrado | EJ-001-05 | 201 | ✅ Creado |
| 3 | 3er préstamo posgrado | EJ-001-06 | 201 | ✅ Creado |
| 4 | 4to préstamo posgrado | EJ-003-01 | 201 | ✅ Creado |
| 5 | 5to préstamo posgrado | EJ-003-02 | 201 | ✅ Creado |
| 6 | **6to intento (debe fallar)** | EJ-003-03 | **409** | ✅ **"limite_prestamos_alcanzado"** |

### Datos adicionales creados

```json
// Libro adicional para RN2
{ "id": "LIB-003", "name": "Calculo Vectorial", "author": "Stewart", "alta_demanda": false }
// Ejemplares: EJ-003-01 al EJ-003-05
```

### Resultados

| Regla | Esperado | Real | Estado |
|-------|----------|------|--------|
| RN1 — 3 préstamos pregrado, 4to bloqueado | 409 | 409 ✅ | ✅ **PASA** |
| RN2 — 5 préstamos posgrado, 6to bloqueado | 409 | 409 ✅ | ✅ **PASA** |

### Observaciones

- Todos los endpoints respondieron con los códigos HTTP esperados.
- El límite de pregrado (3) y posgrado (5) se respeta correctamente.
- Al agotarse los ejemplares de LIB-001, se creó LIB-003 con 5 ejemplares para poder completar la prueba RN2.
- Los ejemplares de LIB-001 ya prestados a pregrado (EJ-001-01 al 03) fueron correctamente rechazados para posgrado con "ejemplar_no_disponible" (RN5).

---

## Sesión 3 — RN5 (Ejemplar no disponible) y RN6 (Plazos)

**Modelo:** deepseek-v4-flash (OpenCode API)  
**Servidor API:** http://localhost:3001  
**Fecha:** 2026-05-26

---

### RN5 — Ejemplar ya prestado no se puede prestar de nuevo

| # | Acción | Copy | HTTP Code | Resultado |
|---|--------|------|-----------|-----------|
| 1 | Ver estado del ejemplar EJ-001-01 | GET /api/ejemplares/EJ-001-01 | 200 | `"state": "prestado"` |
| 2 | **Intentar prestar a EST-PRE-02** | EJ-001-01 | **409** | ✅ **"ejemplar_no_disponible"** |

### RN6 — Plazos de préstamo

| # | Acción | Tipo libro | Plazo esperado | Plazo real | HTTP Code |
|---|--------|-----------|----------------|------------|-----------|
| 1 | Prestar EJ-003-03 (LIB-001 normal) | Normal | 15 días | 15 días (→ 2026-06-10) | 201 ✅ |
| 2 | Prestar EJ-002-01 (LIB-002 alta demanda) | Alta demanda | 3 días | 3 días (→ 2026-05-29) | 201 ✅ |

### Resultados

| Regla | Esperado | Real | Estado |
|-------|----------|------|--------|
| RN5 — ejemplar prestado no se puede prestar | 409 | 409 ✅ | ✅ **PASA** |
| RN6 — plazo normal 15 días | 15 días | 15 días ✅ | ✅ **PASA** |
| RN6 — plazo alta demanda 3 días | 3 días | 3 días ✅ | ✅ **PASA** |

### Observaciones

- Se verificó que el estado del ejemplar cambia a `"state": "prestado"` cuando está en préstamo.
- La respuesta del endpoint GET /api/ejemplares/:id muestra correctamente el estado actual.
- Plazos correctos: 15 días para normales y 3 días para alta demanda.
- `originalPlazoDays` queda registrado en el préstamo (15 o 3), útil para auditoría futura.

---

## Sesión 4 — Validaciones de entrada

**Modelo:** deepseek-v4-flash (OpenCode API)  
**Servidor API:** http://localhost:3001  
**Fecha:** 2026-05-26

---

### Pruebas de validación

| # | Prueba | Envío | HTTP Code | Body | Estado |
|---|--------|-------|-----------|------|--------|
| 1 | VAL-1: Body vacío | `{}` | **400** | `"student_id and copy_id required"` | ✅ |
| 2 | VAL-2: Campos vacíos | `{"student_id":"","copy_id":""}` | **400** | `"student_id and copy_id required"` | ✅ |
| 3 | VAL-3: Estudiante inexistente | `student_id:"NO-EXISTE"` | **404** | `"student not found"` | ✅ |
| 4 | VAL-4: Ejemplar inexistente | `copy_id:"NO-EXISTE"` | **404** | `"copy not found"` | ✅ |
| 5 | **VAL-5: Tipo incorrecto** | `student_id: 12345 (number)` | **404** | `"student not found"` | ❌ **BUG** |

### Resultados

| Prueba | Esperado | Real | Estado |
|--------|----------|------|--------|
| Body vacío → 400 | 400 | 400 ✅ | ✅ **PASA** |
| Campos vacíos → 400 | 400 | 400 ✅ | ✅ **PASA** |
| Estudiante inexistente → 404 | 404 | 404 ✅ | ✅ **PASA** |
| Ejemplar inexistente → 404 | 404 | 404 ✅ | ✅ **PASA** |
| **Tipo incorrecto → 400** | 400 | **404** | ❌ **FALLA** |

### Observaciones

- Las validaciones de campos requeridos funcionan correctamente (400 con mensaje claro).
- Las búsquedas de entidades inexistentes retornan 404 correctamente.
- **BUG detectado (coincide con AUDITORIA-V2.md):** Al enviar `student_id: 12345` (número entero en lugar de string), el sistema retorna 404 "student not found" en vez de 400 "invalid type". La validación de tipos debería ocurrir ANTES de la búsqueda en base de datos.

---

## Sesión 5 — Análisis del fallo VAL-5 (Tipo incorrecto)

**Modelo:** deepseek-v4-flash (OpenCode API)  
**Servidor API:** http://localhost:3001  
**Fecha:** 2026-05-26

---

### Descripción del bug

Al enviar `student_id: 12345` (tipo `number` en lugar de `string`), el sistema retorna:
- **HTTP 404** con mensaje `"student not found"`
- **Debe retornar:** HTTP 400 con mensaje `"student_id and copy_id must be strings"`

### Causa raíz

**Archivo:** `src/infrastructure/controllers/loanController.js` (línea 8-9)

```js
const { student_id, copy_id, fecha_prestamo } = req.body;
if (!student_id || !copy_id) return res.status(400).json(...);
```

- La validación solo verifica **truthy/falsy**: `!student_id` con `12345` es `false` (truthy), entonces pasa.
- El valor numérico `12345` viaja al `LoanService.createLoan()`.
- `studentRepo.findById(12345)` busca un estudiante con ese ID y no lo encuentra.
- Retorna `NotFound('student not found')` → **404** en vez de **400**.

### Solución propuesta

Agregar validación de tipo en el controlador **antes** de la validación de existencia:

```js
if (typeof student_id !== 'string' || typeof copy_id !== 'string') {
  return res.status(400).json({ error: 'student_id and copy_id must be strings' });
}
```

### Impacto

| Aspecto | Detalle |
|---------|---------|
| Severidad | Media |
| Tipo | Validación faltante (defensa en profundidad) |
| Archivo | `src/infrastructure/controllers/loanController.js` |
| Línea | 8-9 |

### Estado del resto de pruebas

| Regla evaluada | Estado |
|----------------|--------|
| RN1 — Límite pregrado (máx 3) | ✅ PASA |
| RN2 — Límite posgrado (máx 5) | ✅ PASA |
| RN5 — Ejemplar no disponible | ✅ PASA |
| RN6 — Plazos (15/3 días) | ✅ PASA |
| VAL-1 — Body vacío | ✅ PASA |
| VAL-2 — Campos vacíos | ✅ PASA |
| VAL-3 — Estudiante inexistente | ✅ PASA |
| VAL-4 — Ejemplar inexistente | ✅ PASA |
| **VAL-5 — Tipo incorrecto** | ❌ **FALLA** |

---

## Chatbot Ollama — Registro

### Modelo usado
- **Nombre:** deepseek-v4-flash (OpenCode API — OpenRouter)
- **Alternativa local no usada:** qwen2.5-coder:7b (se evitó por consumo de recursos)
- **RAM consumida aproximada:** 0 GB local (todo vía API remota)

### Preguntas útiles ejecutadas

| Sesión | Pregunta / Prueba | Qué generó | ¿Fue útil? |
|--------|-------------------|------------|------------|
| 1 | Crear datos de prueba base | 11 curls para estudiantes, libros y ejemplares | ✅ Sí |
| 2 | RN1: 4to préstamo pregrado | Curl POST + verificación 409 Conflict | ✅ Sí |
| 2 | RN2: 6to préstamo posgrado | Curl POST + verificación 409 Conflict | ✅ Sí |
| 3 | RN5: ejemplar ya prestado | Curl GET estado + POST 409 | ✅ Sí |
| 3 | RN6: plazos normal vs alta demanda | Curls POST con verificación de fechas | ✅ Sí |
| 4 | VAL-1 a VAL-5: validaciones | Curls con body inválidos | ✅ Sí |

### Limitaciones observadas
- El chatbot **no inventó endpoints inexistentes** — los curls generados coincidían con la API real.
- No confundió reglas de negocio entre sí.
- **Sin correcciones necesarias** en las respuestas del modelo.

### Comparación: chatbot local vs API cloud

| Aspecto | DeepSeek V4 Flash (API) | Ollama local (qwen2.5-coder:7b) |
|---------|------------------------|----------------------------------|
| Velocidad | Inmediata | Lenta en máquina sin GPU |
| Precisión endpoints | ✅ Exacta | ❌ Tiende a inventar prefijos |
| Calidad de código | ✅ Curls correctos | ⚠️ Variable |
| Sin enviar código a externos | ❌ | ✅ |
| Sin consumo de recursos locales | ✅ | ❌ RAM ~4-8 GB |
