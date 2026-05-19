const { getDatabase } = require('../database/db');

function mapRow(row) {
  if (!row) return null;
  return { ...row, altaDemanda: row.altaDemanda === 1 };
}

function findAll() {
  return getDatabase().prepare('SELECT * FROM books').all().map(mapRow);
}

function findById(id) {
  return mapRow(getDatabase().prepare('SELECT * FROM books WHERE id = ?').get(id));
}

function create({ id, titulo, autor, sala, altaDemanda }) {
  const stmt = getDatabase().prepare(`
    INSERT INTO books (id, titulo, autor, sala, altaDemanda) VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(id, titulo, autor || null, sala || null, altaDemanda ? 1 : 0);
  return findById(id);
}

function update(id, fields) {
  const sets = [];
  const values = [];
  if (fields.titulo !== undefined) { sets.push('titulo = ?'); values.push(fields.titulo); }
  if (fields.autor !== undefined) { sets.push('autor = ?'); values.push(fields.autor); }
  if (fields.sala !== undefined) { sets.push('sala = ?'); values.push(fields.sala); }
  if (fields.altaDemanda !== undefined) { sets.push('altaDemanda = ?'); values.push(fields.altaDemanda ? 1 : 0); }
  if (sets.length === 0) return findById(id);
  values.push(id);
  getDatabase().prepare(`UPDATE books SET ${sets.join(', ')} WHERE id = ?`).run(...values);
  return findById(id);
}

function remove(id) {
  getDatabase().prepare('DELETE FROM books WHERE id = ?').run(id);
}

module.exports = { findAll, findById, create, update, remove };
