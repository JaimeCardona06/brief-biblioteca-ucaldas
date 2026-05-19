const { getDatabase } = require('../database/db');

function findAll() {
  return getDatabase().prepare('SELECT * FROM students').all();
}

function findById(id) {
  return getDatabase().prepare('SELECT * FROM students WHERE id = ?').get(id);
}

function create({ name, email }) {
  const stmt = getDatabase().prepare(`
    INSERT INTO students (name, email) VALUES (?, ?)
  `);
  const result = stmt.run(name, email || null);
  return findById(result.lastInsertRowid);
}

function update(id, fields) {
  const sets = [];
  const values = [];
  if (fields.name !== undefined) { sets.push('name = ?'); values.push(fields.name); }
  if (fields.email !== undefined) { sets.push('email = ?'); values.push(fields.email); }
  if (sets.length === 0) return findById(id);
  values.push(id);
  getDatabase().prepare(`UPDATE students SET ${sets.join(', ')} WHERE id = ?`).run(...values);
  return findById(id);
}

function remove(id) {
  getDatabase().prepare('DELETE FROM students WHERE id = ?').run(id);
}

module.exports = { findAll, findById, create, update, remove };
