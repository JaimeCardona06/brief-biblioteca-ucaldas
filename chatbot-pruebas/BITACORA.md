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
