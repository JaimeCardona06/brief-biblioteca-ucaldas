# Bitácora — Taller Análisis Comparativo V1 vs V2

## Bloque 1: Lectura y comparación estructural

### Ejercicio 1.1 — Inventario de diferencias

| Dimensión | v1 | v2 |
|---|---|---|
| Lenguaje | JavaScript (Node.js + Express) | JavaScript (Node.js + Express) |
| Validación de entradas al servidor | Manual en cada handler (`if (!bookId || !studentId)`) | Manual en el controller (`if (!student_id || !copy_id)`) |
| Manejo de errores HTTP | Inline en cada ruta (`res.status(400).json({...})`) | Clases de error personalizadas (`AppError`, `BadRequest`, `NotFound`, `Conflict`) + middleware centralizado |
| Arquitectura (número de capas) | 1 capa: todo en `index.js` | 3 capas: `application/`, `domain/`, `infrastructure/` |
| Tests incluidos | Ninguno | Ninguno |
| Tipado de datos | Sin tipado | Sin tipado (Clases planas JS con `constructor` y validación en repos) |
| Forma de iniciar la aplicación | `node index.js` | `node index.js` → `src/infrastructure/app.js` |

### Ejercicio 1.2 — Rastreo de RN1 (límite de préstamos simultáneos)

1. **¿En qué archivo está en v1? ¿En cuántas líneas se implementa?**
   - **RN1 NO existe en V1.** El archivo `index.js` (320 líneas) no contiene ninguna verificación de límite de préstamos simultáneos. El endpoint `POST /loans` solo valida que `bookId` y `studentId` estén presentes, que el libro y el estudiante existan, y que el libro tenga copias disponibles. No hay concepto de tipo de estudiante (`tipo`) ni conteo de préstamos activos.

2. **¿En qué archivo(s) está en v2? ¿Qué capas atraviesa?**
   - En V2, RN1 está implementado en `src/application/LoanService.js`, línea 24 (`createLoan`). Atraviesa 3 capas:
     - **Infrastructure/Controller** (`loanController.js`): recibe el request, extrae `student_id` y `copy_id`, llama al servicio.
     - **Application** (`LoanService.js`): contiene la lógica de negocio (consulta repositorios, evalúa el límite).
     - **Domain** (`Student.js`): define el atributo `tipo` ('pregrado' | 'posgrado') que determina el límite (3 o 5).

3. **Si el cliente pide cambiar el límite de pregrado de 3 a 4, ¿cuántos archivos hay que modificar en cada versión?**
   - **V1**: Habría que agregar la funcionalidad completa (archivar tipo de estudiante, conteo de activos, lógica de límite) en el único archivo `index.js`. No hay un cambio puntual porque la feature no existe.
   - **V2**: 1 archivo (`src/application/LoanService.js`, línea 25: cambiar `3` por `4`). El resto del código no se modifica.

4. **¿Cómo sabrías que el cambio no rompió nada en cada versión?**
   - **V1**: Solo se podría verificar manualmente probando endpoints con curl (sin tests automatizados).
   - **V2**: Idealmente ejecutando los tests unitarios. Sin embargo, en el estado actual (sin tests), también requeriría verificación manual o agregar tests primero.

---

## Bloque 2: Análisis de calidad y comportamiento ante errores

### Ejercicio 2.1 — El request que no debería funcionar

*Análisis basado en la lectura del código fuente (no se ejecutaron los servidores).*

1. **¿Qué código HTTP devuelve cada versión?**
   - **V1**: `404 Not Found` (el helper `findStudent(studentId)` no encuentra al estudiante y el handler responde con `res.status(404).json({ error: 'student not found' })`).
   - **V2**: `404 Not Found` (el `LoanService.createLoan` llama a `studentRepo.findById(student_id)`, que retorna `null`, y el servicio lanza `new NotFound('student not found')`, que el middleware centralizado captura y responde con status 404).

2. **¿Qué información contiene el cuerpo de la respuesta en cada caso?**
   - **V1**: `{"error": "student not found"}` — solo un mensaje de texto.
   - **V2**: `{"error": "not_found", "message": "student not found"}` — código de error tipado + mensaje.

3. **¿Cuál respuesta es más útil para un cliente que consume la API?**
   - V2, porque incluye un `error` code (`"not_found"`) que el cliente puede usar en lógica condicional, además del mensaje legible. V1 solo da un mensaje sin código estructurado.

4. **¿Qué pasa en v1 si `ejemplarId` llega como string en lugar de número? ¿Y en v2?**
   - **V1**: El handler espera `bookId`. Usa `findBook(bookId)` que hace `books.find(b => b.id === Number(id))`. Dado que `book.id` es numérico y `Number(bookId)` coerce el string, si el string es numérico (ej. "1") funciona. Si es no-numérico (ej. "abc"), `Number("abc")` da `NaN`, y `NaN === book.id` es `false`, resultando en `404 { error: 'book not found' }`.
   - **V2**: El parámetro se llama `copy_id` en el body. El controller no valida que sea numérico; pasa el valor directamente a `loanService.createLoan`. El `CopyRepository.findById(copy_id)` hace `Number(id)`, con el mismo comportamiento que V1. Si `copy_id` es "abc", `Number("abc")` da `NaN` y retorna `null`, lanzando `NotFound('copy not found')`.

### Ejercicio 2.2 — Comparar errores de dominio

*Análisis basado en la lectura del código fuente (no se ejecutaron los servidores).*

| Aspecto | v1 | v2 |
|---|---|---|
| Código HTTP | `400 Bad Request` (el handler devuelve `res.status(400).json({ error: 'no copies available' })`) | `409 Conflict` (el servicio lanza `new Conflict('ejemplar_no_disponible')`) |
| Campo `error` en la respuesta | `"no copies available"` | `"conflict"` (del error code) |
| Mensaje legible | `"no copies available"` | `"ejemplar_no_disponible"` |
| Información adicional (detalles) | Solo el mensaje | Solo el mensaje (pero pasa por middleware centralizado) |
| ¿Expone información interna del servidor? | No, el mensaje es genérico | No, el mensaje es genérico y controlado |

---

## Bloque 3: Tests ausentes — Análisis teórico

- **Estado**: El archivo `tests/unit/CrearPrestamo.test.ts` **no fue encontrado** en la rama `jaime/FIAT-proyecto-v2`. La ejecución de `git ls-tree -r --name-only jaime/FIAT-proyecto-v2` confirma que no existe ningún directorio `tests/` ni archivos de test en la rama V2.

### Análisis teórico RN3 — Préstamos vencidos pendientes

La RN3 establece que un estudiante con préstamos vencidos no puede realizar nuevos préstamos. En V2, esta regla está implementada en `LoanService.createLoan()` (línea 22):

```javascript
const hasVencidos = this.loanRepo.findByStudent(student.id).some(l => l.estado === 'vencido');
if (unpaid > 0 || hasVencidos) throw new Conflict('bloqueado_por_multas_o_vencidos');
```

Para probar esta regla unitariamente se usarían **mocks** del repositorio `loanRepo`:

1. Crear un mock del `loanRepo` cuyo método `findByStudent` retorne un array que incluya al menos un préstamo con `estado: 'vencido'`.
2. Crear un mock del `fineRepo` cuyo método `sumUnpaidByStudent` retorne `0` (para aislar la prueba al caso de vencidos únicamente).
3. Instanciar `LoanService` con los repos mockeados (inyección de dependencias).
4. Llamar a `createLoan` con un `student_id` y `copy_id` válidos (mockeados en `studentRepo.findById` y `copyRepo.findById`, con `copy.state === 'disponible'`).
5. Verificar que el servicio lance `Conflict` con código `'bloqueado_por_multas_o_vencidos'`.

No es necesario levantar un servidor HTTP porque el servicio es una clase pura que solo depende de interfaces de repositorio.

### Análisis teórico RN4 — Multa pendiente

La RN4 establece que un estudiante con multas pendientes no puede realizar nuevos préstamos. En V2:

```javascript
const unpaid = this.fineRepo.sumUnpaidByStudent(student.id);
if (unpaid > 0 || hasVencidos) throw new Conflict('bloqueado_por_multas_o_vencidos');
```

Para probar esta regla unitariamente:

1. Crear un mock del `fineRepo` cuyo método `sumUnpaidByStudent` retorne un valor > 0 (ej. 5000).
2. Crear un mock del `loanRepo` cuyo método `findByStudent` retorne un array sin préstamos vencidos (para aislar la prueba al caso de multas).
3. Mockear `studentRepo.findById` y `copyRepo.findById` con objetos válidos.
4. Llamar a `createLoan`.
5. Verificar que lance `Conflict` con código `'bloqueado_por_multas_o_vencidos'`.

Ambas pruebas se benefician de la inyección de dependencias: se pueden reemplazar los repositorios reales (que operan sobre arrays en memoria sin persistencia) por implementaciones controladas que devuelvan exactamente los datos que disparan cada regla.

---

## Bloque 4: Test unitario creado

- **Ruta**: `proyecto-v2/tests/unit/CrearPrestamo.test.ts`
- **Propósito**: Verificar que un estudiante de posgrado falla al intentar el sexto préstamo simultáneo (RN1).

### Reflexión comparativa V1 vs V2

Este test sería **significativamente más difícil de escribir en V1** por las siguientes razones:

1. **Inexistencia de la regla de negocio**: V1 no implementa RN1. No hay un conteo de préstamos activos por estudiante ni un concepto de tipo de estudiante (`tipo`). No habría nada que probar sin antes desarrollar la feature completa.

2. **Monolito sin separación de responsabilidades**: En V1 toda la lógica está en el handler `app.post('/loans', ...)` dentro de `index.js`. No hay un "servicio" o "caso de uso" extraíble que se pueda instanciar de forma aislada. Para probar la lógica de préstamos habría que levantar el servidor Express completo y hacer requests HTTP reales.

3. **Dependencias ocultas y estado global**: V1 usa arrays globales (`books`, `students`, `loans`) que mutan durante la ejecución. No hay inyección de dependencias. Para simular "5 préstamos activos" habría que poblarlos manualmente vía requests HTTP o mutando directamente los arrays globales, lo que hace las pruebas lentas, frágiles y no deterministas.

4. **Velocidad de ejecución**: Un test unitario en V2 puramente en memoria (sin servidor) se ejecuta en milisegundos. Un test equivalente en V1 requeriría levantar un servidor Express (varios segundos), hacer requests HTTP, y limpiar el estado entre cada prueba.

En resumen, la arquitectura en capas de V2, la inyección de dependencias y la separación de la lógica de negocio en servicios independientes hacen que las pruebas unitarias sean triviales de escribir y extremadamente rápidas de ejecutar.
