const { getDatabase } = require('./db');

function initDatabase() {
  const db = getDatabase();

  db.exec(`
    CREATE TABLE IF NOT EXISTS books (
      id TEXT PRIMARY KEY,
      titulo TEXT NOT NULL,
      autor TEXT,
      sala TEXT,
      altaDemanda INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      createdAt TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS loans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bookId TEXT NOT NULL REFERENCES books(id),
      studentId INTEGER NOT NULL REFERENCES students(id),
      loanDate TEXT NOT NULL,
      dueDate TEXT NOT NULL,
      returnDate TEXT,
      fine REAL DEFAULT 0,
      status TEXT DEFAULT 'active' CHECK(status IN ('active', 'returned'))
    );
  `);
}

module.exports = { initDatabase };
