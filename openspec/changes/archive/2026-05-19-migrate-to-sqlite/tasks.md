## 1. Setup

- [x] 1.1 Install `better-sqlite3` dependency in package.json
- [x] 1.2 Create `data/` directory and add to `.gitignore`
- [x] 1.3 Create `src/infrastructure/database.js` with SQLite initialization and schema creation

## 2. Corregir IDs alfanuméricos en entidades de dominio

- [x] 2.1 Fix `Book` entity — remove `Number(id)` cast, use string IDs
- [x] 2.2 Fix `Copy` entity — remove `Number(id)` and `Number(book_id)` casts
- [x] 2.3 Fix `Loan` entity — remove `Number(id)`, `Number(student_id)`, `Number(copy_id)` casts
- [x] 2.4 Fix `Student` entity — remove `Number(id)` cast
- [x] 2.5 Fix `Fine` entity — remove `Number(id)`, `Number(prestamo_id)`, `Number(student_id)` casts
- [x] 2.6 Fix `Solicitud` entity — remove `Number(id)`, `Number(student_id)`, `Number(book_id)` casts

## 3. Refactorizar repositorios a SQLite

- [x] 3.1 Refactor `BookRepository` — implementar métodos con SQLite (create, findById, list, update)
- [x] 3.2 Refactor `CopyRepository` — implementar métodos con SQLite (create, findById, findByBook, update)
- [x] 3.3 Refactor `StudentRepository` — implementar métodos con SQLite (create, findById, update)
- [x] 3.4 Refactor `LoanRepository` — implementar métodos con SQLite (create, findById, findByStudent, countActiveByStudent, listActiveOverdue, update)
- [x] 3.5 Refactor `FineRepository` — implementar métodos con SQLite (create, sumUnpaidByStudent)
- [x] 3.6 Refactor `SolicitudRepository` — implementar métodos con SQLite (create, findActiveByBook, markSatisfied)

## 4. Actualizar wiring en infraestructura

- [x] 4.1 Update `app.js` — inyectar instancia de BD a todos los repositorios
- [x] 4.2 Update `app.js` — inicializar BD antes de crear repositorios
- [x] 4.3 Verificar que el servidor arranca sin errores

## 5. Verificación

- [x] 5.1 Arrancar servidor y confirmar que `data/biblioteca.db` se crea con todas las tablas
- [x] 5.2 Crear un libro, un estudiante, un ejemplar vía API (deberían persistir)
- [x] 5.3 Crear un préstamo y verificar que se guarda en SQLite
- [x] 5.4 Reiniciar servidor y confirmar que los datos persisten
- [x] 5.5 Probar caso borde: ID alfanumérico como "LIB-001" funciona correctamente
