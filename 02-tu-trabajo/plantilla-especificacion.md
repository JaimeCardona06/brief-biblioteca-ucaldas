# Especificación Formal — Sistema de Préstamo de Libros

> **Autor:** [Daner Alejandro Salazar Colorado, Jaime Andrés Cardona Díaz]
> **Fecha:** [5-05-2026]
> **Versión:** 1.0
> **Brief de origen:** Correo de Diana Restrepo, Coordinadora de Biblioteca

> Lo que está entre corchetes `[...]` es lo que tú debes escribir.

---

## 1. Propósito del sistema

[Gestionar el prestado y la devolución de libros de la biblioteca, proporcionando un sistema con la capacidad de manejar el plazo, las multas, los limites de libros por estudiante, el historial, las renovaciones y las solicitudes de libros.]

---

## 2. Alcance

**Incluido en esta versión:**

- [ 1. Listado de libros disponibles (Paginación)
    2. Gestión de libros (CRUD)
    3. Manejo de solicitudes de libros disponibles
    4. Manejo de solciitudes de libros no disponibles
    5. Control de limite de libros por estudiante
    6. Notificaciones para fecha de vencimiento del prestamo de libro
    7. Historial de prestamo y devolución de libros
    8. Control de multas por entrega de libro fuera del la fecha de regreso
  ]

**Explícitamente fuera del alcance:**

- [ 1. El manejo del prestamo a estudiantes de postgrado
    2. El manejo del prestado a profesores investigadores
  ]

---

## 3. Modelo de datos

### Entidad: Libro

| Campo     | Tipo     | Obligatorio | Descripción   |
| `[id]` | `[int]` | sí      | [Identificador único del libro] |
| `[name]` | `[string]` | sí      | [Nombre del libro] |
| `[author]` | `[string]` | sí      | [Autor del libro] |
| `[location]` | `[int]` | no      | [Relación con la sala] |


### Entidad: Ejemplar

[Repite la tabla. Cada libro puede tener varios ejemplares. Decide tú la estructura.]

| Campo     | Tipo     | Obligatorio | Descripción   |
| `[id]` | `[int]` | sí      | [Identificador único del ejemplar] |
| `[code]` | `[string]` | sí      | [Código de barras] |
| `[state]` | `[string]` | sí      | [Estado del libro] |
| `[loan_date]` | `[date]` | no      | [Fecha del prestamo] |
| `[id_libro]` | `[int]` | no      | [Relación con el libro] |

### Entidad: Estudiante

[Tabla de campos]

| Campo     | Tipo     | Obligatorio | Descripción   |
| `[id]` | `[int]` | sí      | [Identificador único del estudiante] |
| `[code]` | `[string]` | sí      | [Código del estudiante] |
| `[name]` | `[string]` | sí      | [Nombre del estudiante] |
| `[id_program]` | `[int]` | sí      | [Relación con el progama] |

### Entidad: Programa

[Tabla de campos]

| Campo     | Tipo     | Obligatorio | Descripción   |
| `[id]` | `[int]` | sí      | [Identificador único del programa] |
| `[code]` | `[string]` | sí      | [Código del programa] |
| `[name]` | `[string]` | sí      | [Nombre del programa] |


### Entidad: Préstamo

[Tabla de campos. Aquí va estudiante_id, ejemplar_id, fecha_prestamo, fecha_devolucion_esperada, fecha_devolucion_real, estado, etc.]

| Campo     | Tipo     | Obligatorio | Descripción   |
| `[id]` | `[int]` | sí      | [Identificador único del prestamo] |
| `[code]` | `[string]` | sí      | [Código del prestamo] |
| `[state]` | `[string]` | sí      | [Estado del prestamo] |
| `[loan_date]` | `[date]` | sí      | [Fecha del prestamo] |
| `[expected_return_date]` | `[date]` | sí      | [Fecha de devolución esperada] |
| `[actual_return_date]` | `[date]` | sí      | [Fecha de devolución real] |
| `[id_student]` | `[int]` | sí      | [Relación con el estudiante] |
| `[copy_id]` | `[int]` | sí      | [Relación con el ejemplar] |

### Entidad: Multa

[Tabla de campos]

| Campo     | Tipo     | Obligatorio | Descripción   |
| `[id]` | `[int]` | sí      | [Identificador único de la multa] |
| `[code]` | `[string]` | sí      | [Código de la multa] |
| `[amount]` | `[string]` | sí      | [Cantidad de multa] |
| `[id_student]` | `[int]` | sí      | [Relación con el estudiante] |
| `[id_loan]` | `[int]` | sí      | [Relación con el prestamo] |

### Diagrama de relaciones

```
[Dibuja con texto las relaciones. Por ejemplo:

Libro 1 --- N Ejemplar
Estudiante 1 --- N Prestamo
Ejemplar 1 --- N Prestamo (a lo largo del tiempo)
Prestamo 0..1 --- 1 Multa
Programa 1 --- N Estudiante
]
```

---

## 4. Endpoints REST

| Método | Ruta | Propósito | Body / Query | Respuesta éxito | Códigos error posibles |
|---|---|---|---|---|---|
| `GET` | `/libros` | Listar catálogo | filtros opcionales | `200` con lista | - |
| `GET` | `/libros/:id` | Detalle libro | - | `200` con objeto | `404` |
| `POST` | `/prestamos` | Crear préstamo | `{estudiante_id, ejemplar_id}` | `201` con préstamo | `400`, `404`, `409` |
| ... | ... | ... | ... | ... | ... |

[Llena la tabla con todos los endpoints que necesitas. Mínimo 8.]

---

## 5. Reglas de negocio

### RN1 — [nombre corto de la regla]

- **Trigger:** [cuándo se evalúa]
- **Condición:** [qué se valida exactamente, en términos precisos]
- **Acción si cumple:** [qué hace el sistema]
- **Acción si no cumple:** [código HTTP, mensaje, qué retorna]

**Ejemplo:**

### RN1 — Límite de préstamos por tipo de estudiante

- **Trigger:** al recibir `POST /prestamos`.
- **Condición:**
  - Estudiante de pregrado: máximo 3 préstamos con `estado = "activo"`.
  - Estudiante de posgrado: máximo 5 préstamos con `estado = "activo"`.
- **Acción si cumple:** continuar con el flujo de creación.
- **Acción si no cumple:** retornar `409 Conflict` con `{error: "limite_prestamos_alcanzado", limite: N, actuales: M}`.

[Llena RN2, RN3, RN4... hasta cubrir todas las reglas del correo.]

### RN2 — [...]

[...]

### RN3 — [...]

[...]


---

## 6. Decisiones tomadas (lo que el correo no dice)

### D1 — [Decisión que tomaste]

- **Contexto:** [qué hueco había]
- **Decisión:** [qué decidiste]
- **Justificación:** [por qué esta decisión y no otra]

**Ejemplo:**

### D1 — Cálculo de días para multa

- **Contexto:** el correo no precisa si los días de retraso son calendario o hábiles.
- **Decisión:** usar días calendario.
- **Justificación:** es la interpretación más simple y se alinea con lo que la mayoría de bibliotecas hacen.

[Mínimo 5 decisiones documentadas.]

### D2, D3, D4, D5...

---

## 7. Códigos HTTP usados

| Código | Significado | Cuándo se usa |
|---|---|---|
| 200 | OK | GET exitosos |
| 201 | Created | POST exitosos que crean recursos |
| 400 | Bad Request | Body malformado o validación fallida |
| 404 | Not Found | Recurso no existe |
| 409 | Conflict | Reglas de negocio violadas (límite alcanzado, duplicado, etc.) |
| 500 | Internal Server Error | Error no controlado del servidor |

[Si usas otros, agrégalos.]

---

## 8. Restricciones técnicas

- **Stack:** [Node.js + Express]
- **Persistencia:** datos en memoria. No usar base de datos.
- **TypeScript** (según tu stack).
- **Sin autenticación** en esta versión.
- **Sin frontend** en esta versión. Solo API REST.