const { getDatabase } = require('../database/db');

function findAll() {
  return getDatabase().prepare('SELECT * FROM books').all();
}

function findById(id) {
  return getDatabase().prepare('SELECT * FROM books WHERE id = ?').get(id);
}

function create({ title, author, isbn, copies }) {
  const stmt = getDatabase().prepare(`
    INSERT INTO books (title, author, isbn, copies) VALUES (?, ?, ?, ?)
  `);
  const result = stmt.run(title, author || null, isbn || null, Number.isInteger(copies) ? Math.max(0, copies) : 1);
  return findById(result.lastInsertRowid);
}

function update(id, fields) {
  const sets = [];
  const values = [];
  if (fields.title !== undefined) { sets.push('title = ?'); values.push(fields.title); }
  if (fields.author !== undefined) { sets.push('author = ?'); values.push(fields.author); }
  if (fields.isbn !== undefined) { sets.push('isbn = ?'); values.push(fields.isbn); }
  if (fields.copies !== undefined && Number.isInteger(fields.copies)) { sets.push('copies = ?'); values.push(Math.max(0, fields.copies)); }
  if (sets.length === 0) return findById(id);
  values.push(id);
  getDatabase().prepare(`UPDATE books SET ${sets.join(', ')} WHERE id = ?`).run(...values);
  return findById(id);
}

function remove(id) {
  getDatabase().prepare('DELETE FROM books WHERE id = ?').run(id);
}

function copyCount(id) {
  const row = getDatabase().prepare('SELECT copies FROM books WHERE id = ?').get(id);
  return row ? row.copies : 0;
}

function decrementCopies(id) {
  getDatabase().prepare('UPDATE books SET copies = copies - 1 WHERE id = ? AND copies > 0').run(id);
}

function incrementCopies(id) {
  getDatabase().prepare('UPDATE books SET copies = copies + 1 WHERE id = ?').run(id);
}

module.exports = { findAll, findById, create, update, remove, copyCount, decrementCopies, incrementCopies };
