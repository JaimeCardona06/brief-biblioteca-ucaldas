# Prompt — Migrar de arreglos en memoria a SQLite

## Stack
- Node.js + Express
- better-sqlite3 (síncrono, singleton)
- Base de datos local SQLite

## Requerimientos

1. Reemplazar los 3 arreglos en memoria (`books`, `students`, `loans`) por una base de datos SQLite local.
2. Usar `better-sqlite3` con patrón **singleton**: un solo archivo `src/database/db.js` que expone una única instancia de la conexión.
3. El archivo de base de datos debe estar en `database/biblioteca.db` (se crea automáticamente si no existe).
4. No hay migración de datos — se arranca limpio.
5. Separar el código en capas:
   - `src/database/db.js` — singleton de conexión
   - `src/database/init.js` — creación de tablas
   - `src/models/*.repository.js` — acceso a datos (CRUD)
   - `src/routes/*.js` — definición de rutas
   - `index.js` — solo importa rutas y arranca el servidor
6. La API pública debe mantener los mismos endpoints y semántica:
   - `GET/POST /books`, `GET/PUT/DELETE /books/:id`
   - `GET/POST /students`, `GET/PUT/DELETE /students/:id`
   - `GET/POST /loans`, `GET /loans/:id`
   - `POST /loans/:id/return`
   - `GET /students/:id/fines`
   - `GET /students/:id/loans`
   - `GET /books/:id/loans`

## Esquema SQLite

```sql
CREATE TABLE IF NOT EXISTS books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author TEXT,
  isbn TEXT,
  copies INTEGER DEFAULT 1,
  createdAt TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  createdAt TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS loans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bookId INTEGER NOT NULL REFERENCES books(id),
  studentId INTEGER NOT NULL REFERENCES students(id),
  loanDate TEXT NOT NULL,
  dueDate TEXT NOT NULL,
  returnDate TEXT,
  fine REAL DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK(status IN ('active','returned'))
);
```

## Patrón Singleton

```js
// src/database/db.js
const Database = require('better-sqlite3');
const path = require('path');

let instance = null;

function getDatabase() {
  if (!instance) {
    instance = new Database(path.join(__dirname, '../../database/biblioteca.db'));
    instance.pragma('journal_mode = WAL');
    instance.pragma('foreign_keys = ON');
  }
  return instance;
}

module.exports = { getDatabase };
```

## Reglas de negocio a preservar

1. Al crear un préstamo, si el libro no tiene copias disponibles (`copies < 1`), devolver 400.
2. Al crear un préstamo, decrementar `copies` del libro.
3. Al devolver un préstamo (`POST /loans/:id/return`), calcular multa si está vencido (FINE_PER_DAY = 1, días calendario).
4. Al devolver un préstamo, incrementar `copies` del libro.
5. No se puede eliminar un libro/estudiante si tiene préstamos activos.
6. Préstamos activos tienen `status = 'active'`, devueltos tienen `status = 'returned'`.

## Constantes

- DEFAULT_LOAN_DAYS = 14
- FINE_PER_DAY = 1
- MS_PER_DAY = 24 * 60 * 60 * 1000

## Estructura final de archivos

```
biblioteca-ucaldas/
├── src/
│   ├── database/
│   │   ├── db.js
│   │   └── init.js
│   ├── models/
│   │   ├── book.repository.js
│   │   ├── student.repository.js
│   │   └── loan.repository.js
│   └── routes/
│       ├── books.js
│       ├── students.js
│       └── loans.js
├── database/
│   └── .gitkeep
├── index.js
└── package.json
```

## Restricciones

- No agregar dependencias adicionales fuera de `better-sqlite3`.
- No generar tests todavía.
- No cambiar la semántica de los endpoints.
