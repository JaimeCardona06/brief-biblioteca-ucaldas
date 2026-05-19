const path = require('path');
const Database = require('better-sqlite3');

const DB_PATH = path.join(__dirname, '..', '..', 'data', 'biblioteca.db');

let instance = null;

function getDatabase() {
  if (instance) return instance;

  instance = new Database(DB_PATH);
  instance.pragma('journal_mode = WAL');
  instance.pragma('foreign_keys = ON');

  instance.exec(`
    CREATE TABLE IF NOT EXISTS libros (
      id TEXT PRIMARY KEY,
      codigo_inventario TEXT,
      name TEXT,
      author TEXT,
      location TEXT,
      alta_demanda INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT
    );

    CREATE TABLE IF NOT EXISTS ejemplares (
      id TEXT PRIMARY KEY,
      code TEXT,
      book_id TEXT NOT NULL,
      state TEXT NOT NULL DEFAULT 'disponible',
      notas TEXT,
      reservedUntil TEXT,
      FOREIGN KEY (book_id) REFERENCES libros(id)
    );

    CREATE TABLE IF NOT EXISTS estudiantes (
      id TEXT PRIMARY KEY,
      code TEXT,
      name TEXT,
      program_id TEXT,
      tipo TEXT NOT NULL DEFAULT 'pregrado',
      multas_pendientes REAL NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS prestamos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id TEXT NOT NULL,
      copy_id TEXT NOT NULL,
      fecha_prestamo TEXT,
      fecha_devolucion_esperada TEXT,
      fecha_devolucion_real TEXT,
      estado TEXT NOT NULL DEFAULT 'activo',
      renovaciones INTEGER NOT NULL DEFAULT 0,
      original_plazo_days INTEGER,
      FOREIGN KEY (student_id) REFERENCES estudiantes(id),
      FOREIGN KEY (copy_id) REFERENCES ejemplares(id)
    );

    CREATE TABLE IF NOT EXISTS multas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      prestamo_id INTEGER NOT NULL,
      student_id TEXT NOT NULL,
      dias_atraso INTEGER NOT NULL,
      monto REAL NOT NULL,
      pagada INTEGER NOT NULL DEFAULT 0,
      fecha_generada TEXT,
      FOREIGN KEY (prestamo_id) REFERENCES prestamos(id),
      FOREIGN KEY (student_id) REFERENCES estudiantes(id)
    );

    CREATE TABLE IF NOT EXISTS solicitudes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id TEXT NOT NULL,
      book_id TEXT NOT NULL,
      estado TEXT NOT NULL DEFAULT 'activa',
      createdAt TEXT,
      satisfechaAt TEXT,
      FOREIGN KEY (student_id) REFERENCES estudiantes(id),
      FOREIGN KEY (book_id) REFERENCES libros(id)
    );
  `);

  return instance;
}

function closeDatabase() {
  if (instance) {
    instance.close();
    instance = null;
  }
}

module.exports = { getDatabase, closeDatabase };
