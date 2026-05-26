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

## Sesión 2 — Pruebas RN1 y RN2

### RN1 — Límite de préstamos (pregrado)

**Objetivo:** Verificar que un estudiante de pregrado (EST-PRE-01) no pueda tener más de 3 préstamos activos.

**Fecha:** 2026-05-26

### Pasos ejecutados
1. Crear 3 préstamos válidos para EST-PRE-01 usando ejemplares EJ-001-01 .. EJ-001-03.
   - Comandos (resumidos):
     - curl -X POST "http://localhost:3001/api/prestamos" -H "Content-Type: application/json" -d '{"student_id":"EST-PRE-01","copy_id":"EJ-001-01"}'
     - curl -X POST "http://localhost:3001/api/prestamos" -H "Content-Type: application/json" -d '{"student_id":"EST-PRE-01","copy_id":"EJ-001-02"}'
     - curl -X POST "http://localhost:3001/api/prestamos" -H "Content-Type: application/json" -d '{"student_id":"EST-PRE-01","copy_id":"EJ-001-03"}'

2. Intentar crear un cuarto préstamo para EST-PRE-01 con EJ-001-04.
   - Comando:
     - curl -X POST "http://localhost:3001/api/prestamos" -H "Content-Type: application/json" -d '{"student_id":"EST-PRE-01","copy_id":"EJ-001-04"}'

### Resultados observados
- Préstamo 1: 201 Created
  - Respuesta:
  ```json
  {"id":1,"student_id":"EST-PRE-01","copy_id":"EJ-001-01","fecha_prestamo":"2026-05-26","fecha_devolucion_esperada":"2026-06-10","fecha_devolucion_real":null,"estado":"activo","renovaciones":0,"originalPlazoDays":15}
  ```
- Préstamo 2: 201 Created
  - Respuesta:
  ```json
  {"id":2,"student_id":"EST-PRE-01","copy_id":"EJ-001-02","fecha_prestamo":"2026-05-26","fecha_devolucion_esperada":"2026-06-10","fecha_devolucion_real":null,"estado":"activo","renovaciones":0,"originalPlazoDays":15}
  ```
- Préstamo 3: 201 Created
  - Respuesta:
  ```json
  {"id":3,"student_id":"EST-PRE-01","copy_id":"EJ-001-03","fecha_prestamo":"2026-05-26","fecha_devolucion_esperada":"2026-06-10","fecha_devolucion_real":null,"estado":"activo","renovaciones":0,"originalPlazoDays":15}
  ```
- Préstamo 4 (intento): 409 Conflict
  - Respuesta:
  ```json
  {"error":"conflict","message":"limite_prestamos_alcanzado"}
  ```

### Conclusión
- La regla RN1 se verifica correctamente: el sistema permite hasta 3 préstamos activos para un estudiante de pregrado y rechaza el cuarto con 409 Conflict.
- Observaciones:
  - `originalPlazoDays: 15` confirma que se aplicó el plazo de libro normal.
  - Todos los préstamos creados quedaron en estado `activo`.

---

### RN2 — Límite de préstamos (posgrado)

**Objetivo:** Verificar que un estudiante de posgrado (EST-POS-01) no pueda tener más de 5 préstamos activos.

**Fecha:** 2026-05-26

### Pasos ejecutados
1. Intentar crear préstamos para EST-POS-01 con ejemplares EJ-001-01 .. EJ-001-05:
   - curl -X POST "http://localhost:3001/api/prestamos" -H "Content-Type: application/json" -d '{"student_id":"EST-POS-01","copy_id":"EJ-001-01"}'
   - curl -X POST "http://localhost:3001/api/prestamos" -H "Content-Type: application/json" -d '{"student_id":"EST-POS-01","copy_id":"EJ-001-02"}'
   - curl -X POST "http://localhost:3001/api/prestamos" -H "Content-Type: application/json" -d '{"student_id":"EST-POS-01","copy_id":"EJ-001-03"}'
   - curl -X POST "http://localhost:3001/api/prestamos" -H "Content-Type: application/json" -d '{"student_id":"EST-POS-01","copy_id":"EJ-001-04"}'
   - curl -X POST "http://localhost:3001/api/prestamos" -H "Content-Type: application/json" -d '{"student_id":"EST-POS-01","copy_id":"EJ-001-05"}'

2. Intentar crear sexto préstamo (ejemplar de alta demanda):
   - curl -X POST "http://localhost:3001/api/prestamos" -H "Content-Type: application/json" -d '{"student_id":"EST-POS-01","copy_id":"EJ-002-01"}'

### Resultados observados
- EJ-001-01 → 409 Conflict
  - Respuesta: {"error":"conflict","message":"ejemplar_no_disponible"}
- EJ-001-02 → 409 Conflict
  - Respuesta: {"error":"conflict","message":"ejemplar_no_disponible"}
- EJ-001-03 → 409 Conflict
  - Respuesta: {"error":"conflict","message":"ejemplar_no_disponible"}
- EJ-001-04 → 201 Created
  - Respuesta:
  ```json
  {"id":4,"student_id":"EST-POS-01","copy_id":"EJ-001-04","fecha_prestamo":"2026-05-26","fecha_devolucion_esperada":"2026-06-10","fecha_devolucion_real":null,"estado":"activo","renovaciones":0,"originalPlazoDays":15}
  ```
- EJ-001-05 → 201 Created
  - Respuesta:
  ```json
  {"id":5,"student_id":"EST-POS-01","copy_id":"EJ-001-05","fecha_prestamo":"2026-05-26","fecha_devolucion_esperada":"2026-06-10","fecha_devolucion_real":null,"estado":"activo","renovaciones":0,"originalPlazoDays":15}
  ```
- EJ-002-01 (intento sexto) → 201 Created
  - Respuesta:
  ```json
  {"id":6,"student_id":"EST-POS-01","copy_id":"EJ-002-01","fecha_prestamo":"2026-05-26","fecha_devolucion_esperada":"2026-05-29","fecha_devolucion_real":null,"estado":"activo","renovaciones":0,"originalPlazoDays":3}
  ```

### Conclusión
- El sistema respondió 409 cuando el ejemplar no estaba disponible (ejemplar_no_disponible) y creó préstamos (201) cuando había ejemplares disponibles.
- Importante: la prueba RN2 no pudo alcanzarse a 5 préstamos activos para EST-POS-01 porque varios ejemplares estaban ocupados por la prueba RN1. Para verificar RN2 completamente se requieren 5 ejemplares distintos disponibles (o devolver algunos préstamos antes de volver a intentar).
- El préstamo en alta demanda (EJ-002-01) aplicó `originalPlazoDays: 3` correctamente.
