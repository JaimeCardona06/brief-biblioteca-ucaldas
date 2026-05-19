# Progress — migrate-to-sqlite

## Sesión 1 — Bloque 1: Setup & Entities

| Tiempo | Tarea | Estado | Archivos mutados |
|---|---|---|---|
| 1 | 1.1 Install better-sqlite3 | Completado | package.json |
| 2 | 1.2 Create data/ + .gitignore | Completado | .gitignore, data/ |
| 3 | 1.3 Create database.js | Completado | src/infrastructure/database.js |
| 4 | 2.1 Fix Book entity | Completado | src/domain/entities/Book.js |
| 5 | 2.2 Fix Copy entity | Completado | src/domain/entities/Copy.js |
| 6 | 2.3 Fix Loan entity | Completado | src/domain/entities/Loan.js |
| 7 | 2.4 Fix Student entity | Completado | src/domain/entities/Student.js |
| 8 | 2.5 Fix Fine entity | Completado | src/domain/entities/Fine.js |
| 9 | 2.6 Fix Solicitud entity | Completado | src/domain/entities/Solicitud.js |
| 10 | 3.1 BookRepository SQLite | Completado | src/infrastructure/repositories/BookRepository.js |
| 11 | 3.2 CopyRepository SQLite | Completado | src/infrastructure/repositories/CopyRepository.js |
| 12 | 3.3 StudentRepository SQLite | Completado | src/infrastructure/repositories/StudentRepository.js |
| 13 | 3.4 LoanRepository SQLite | Completado | src/infrastructure/repositories/LoanRepository.js |
| 14 | 3.5 FineRepository SQLite | Completado | src/infrastructure/repositories/FineRepository.js |
| 15 | 3.6 SolicitudRepository SQLite | Completado | src/infrastructure/repositories/SolicitudRepository.js |
| 16 | 4.1-4.2 Update app.js wiring | Completado | src/infrastructure/app.js |
| 17 | 4.3 Server starts | Completado | — |
| 18 | 5.1-5.5 Verification | Completado | data/biblioteca.db |

## Hallazgos durante Bloque 1

- **Crítico**: Los repositorios en memoria comparan con `Number(id)` — esto produce `NaN` al recibir strings alfanuméricos ("LIB-001").
  Archivos: BookRepository:16, CopyRepository:18,22, StudentRepository:16, FineRepository:16, LoanRepository:16,20,24, SolicitudRepository:10,18,22
  Se resolverá en Bloque 3 (refactorización a SQLite).

## Hallazgos durante Bloques 3-5

- **Resuelto por diseño**: Al migrar los 6 repositorios a SQLite, las comparaciones con `Number()` desaparecen. SQLite maneja TEXT PKs de forma nativa.
- **Hallazgo**: El controlador `POST /libros` no acepta `id` en el body, solo `codigo_inventario`. El repositorio ahora usa `codigo_inventario` como fallback para el PK.
- **Hallazgo**: Los datos persisten correctamente tras reinicios — verificado con ciclo start→crear→kill→start→consulta.

- **Crítico**: Los repositorios en memoria comparan con `Number(id)` — esto produce `NaN` al recibir strings alfanuméricos ("LIB-001").
  Archivos: BookRepository:16, CopyRepository:18,22, StudentRepository:16, FineRepository:16, LoanRepository:16,20,24, SolicitudRepository:10,18,22
  Se resolverá en Bloque 3 (refactorización a SQLite).
