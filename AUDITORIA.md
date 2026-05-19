# Auditoría de API — Biblioteca

**Fecha:** 2026-05-19

---

## Curl 1 — POST /api/libros

**Curl enviado:**
```bash
curl -s -X POST $BASE_CON_IA/api/libros \
  -H "Content-Type: application/json" \
  -d '{
    "id": "LIB-001",
    "titulo": "Ingenieria del Software",
    "autor": "Pressman",
    "sala": "Sala General",
    "altaDemanda": false
  }'
```

### Historial de errores encontrados

| # | Intento | Resultado | Problema |
|---|---------|-----------|----------|
| 1 | `curl -s http://localhost:3000/estudiante` | `{"error":"not found"}` | La ruta era `/students` (inglés), no `/estudiante` |
| 2 | `POST /api/libros` con `id`, `titulo`, `autor`, `sala`, `altaDemanda` | `{"error":"not found"}` | El endpoint era `/books` (inglés, sin prefijo `/api`), no `/api/libros` |
| 3 | Mismo curl contra `/books` | Error de validación | La API esperaba `title`, `author`, `isbn`, `copies`; el curl enviaba `titulo`, `autor`, `sala`, `altaDemanda` |

### Problemas detectados

| # | Problema | Detalle |
|---|---|---|
| 1 | **Endpoint inexistente** | La API tenía `/books` (inglés), no `/api/libros` (español con prefijo `/api`) |
| 2 | **Campos del modelo incorrectos** | La API esperaba `title`, `author`, `isbn`, `copies`; el curl envía `titulo`, `autor`, `sala`, `altaDemanda` |
| 3 | **Tipo de ID incorrecto** | La API usaba `INTEGER AUTOINCREMENT`; el curl envía un ID alfanumérico (`LIB-001`) |
| 4 | **Falta campo `sala`** | La tabla books no contemplaba sala/ubicación del libro |
| 5 | **Falta campo `altaDemanda`** | La tabla books no tenía un indicador de alta demanda |
| 6 | **Sobran campos `isbn` y `copies`** | El modelo anterior tenía ISBN y copias que el nuevo modelo no necesita |

### Acción correctiva aplicada

- Rutas migradas a español con prefijo `/api`: `/api/libros`, `/api/estudiantes`, `/api/prestamos`
- Tabla `books` rediseñada: `id TEXT PRIMARY KEY`, `titulo`, `autor`, `sala`, `altaDemanda` (INTEGER 0/1)
- Eliminados campos `isbn`, `copies`, `createdAt` de books
- Eliminada lógica de inventario (copies) en préstamos
- Relación loans.bookId actualizada a TEXT para coincidir con books.id
- Corrección posterior: `altaDemanda` se almacena como INTEGER (0/1) en SQLite pero se devuelve como booleano (`true`/`false`) en la respuesta JSON mediante `mapRow()` en `book.repository.js`

### Estado final

```json
// POST /api/libros
{"id":"LIB-001","titulo":"Ingenieria del Software","autor":"Pressman","sala":"Sala General","altaDemanda":false}

// GET /api/libros
[{"id":"LIB-001","titulo":"Ingenieria del Software","autor":"Pressman","sala":"Sala General","altaDemanda":false}]
```

---

*Documentación generada durante sesión de trabajo — 2026-05-19*
