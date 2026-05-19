const Copy = require('../../domain/entities/Copy');

class CopyRepository {
  constructor({ db }) {
    this.db = db;
  }

  create({ id, code, book_id }) {
    const existing = this.db.prepare('SELECT id FROM ejemplares WHERE code = ?').get(code);
    if (existing) throw new Error('copy_code_exists');
    const copy = new Copy({ id: id || code, code, book_id, state: 'disponible' });
    this.db.prepare(`
      INSERT INTO ejemplares (id, code, book_id, state, notas, reservedUntil)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(copy.id, copy.code, copy.book_id, copy.state, null, null);
    return copy;
  }

  findById(id) {
    const row = this.db.prepare('SELECT * FROM ejemplares WHERE id = ?').get(String(id));
    if (!row) return null;
    return new Copy({
      id: row.id,
      code: row.code,
      book_id: row.book_id,
      state: row.state,
      notas: row.notas,
      reservedUntil: row.reservedUntil
    });
  }

  findByBook(bookId) {
    const rows = this.db.prepare('SELECT * FROM ejemplares WHERE book_id = ?').all(String(bookId));
    return rows.map(row => new Copy({
      id: row.id,
      code: row.code,
      book_id: row.book_id,
      state: row.state,
      notas: row.notas,
      reservedUntil: row.reservedUntil
    }));
  }

  update(copy) {
    this.db.prepare(`
      UPDATE ejemplares SET state = ?, notas = ?, reservedUntil = ? WHERE id = ?
    `).run(copy.state, copy.notas, copy.reservedUntil, copy.id);
    return copy;
  }
}

module.exports = CopyRepository;
