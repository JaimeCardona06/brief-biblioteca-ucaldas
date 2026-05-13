# Biblioteca API (sencilla)

API REST básica en Node.js + Express para gestionar préstamos de libros. Los datos se guardan en memoria (no hay base de datos). Se crean tres colecciones: books, students y loans.

Instrucciones:

- Instalar dependencias: `npm install`
- Ejecutar: `npm start` (por defecto en el puerto 3000)

Endpoints principales:

- GET / -> información básica

- Books
  - POST /books { title, author?, isbn?, copies? } -> crear libro
  - GET /books -> listar libros
  - GET /books/:id -> obtener libro
  - PUT /books/:id -> actualizar libro
  - DELETE /books/:id -> eliminar libro (no permite si tiene préstamos activos)

- Students
  - POST /students { name, email? } -> crear estudiante
  - GET /students -> listar estudiantes
  - GET /students/:id -> obtener estudiante
  - PUT /students/:id -> actualizar estudiante
  - DELETE /students/:id -> eliminar estudiante (no permite si tiene préstamos activos)

- Loans
  - POST /loans { bookId, studentId, loanDays? } -> crea préstamo (disminuye copies)
  - GET /loans -> listar préstamos (opcional ?status=active|returned)
  - GET /loans/:id -> obtener préstamo
  - POST /loans/:id/return -> marcar devolución, calcula multa por días de retraso (FINE_PER_DAY = 1)

- Fines
  - GET /students/:id/fines -> muestra suma de multas ya devengadas y multas de préstamos activos atrasados

Observaciones:

- Todos los datos se pierden cuando se reinicia la aplicación.
- La moneda de la multa no está especificada; `FINE_PER_DAY` en el código es el valor por defecto (1 unidad por día).
