const Solicitud = require('../../domain/entities/Solicitud');

class SolicitudRepository {
  constructor({ db }) {
    this.db = db;
  }

  create({ student_id, book_id }) {
    const existing = this.db.prepare(`
      SELECT id FROM solicitudes WHERE book_id = ? AND student_id = ? AND estado = 'activa'
    `).get(String(book_id), String(student_id));
    if (existing) {
      const row = this.db.prepare('SELECT * FROM solicitudes WHERE id = ?').get(existing.id);
      return new Solicitud(row);
    }
    const now = new Date().toISOString();
    const info = this.db.prepare(`
      INSERT INTO solicitudes (student_id, book_id, estado, createdAt, satisfechaAt)
      VALUES (?, ?, 'activa', ?, NULL)
    `).run(String(student_id), String(book_id), now);
    return new Solicitud({
      id: info.lastInsertRowid,
      student_id,
      book_id,
      estado: 'activa',
      createdAt: now,
      satisfechaAt: null
    });
  }

  findActiveByBook(bookId) {
    const rows = this.db.prepare(`
      SELECT * FROM solicitudes WHERE book_id = ? AND estado = 'activa' ORDER BY createdAt ASC
    `).all(String(bookId));
    return rows.map(row => new Solicitud(row));
  }

  markSatisfied(solicitudId) {
    const s = this.db.prepare('SELECT * FROM solicitudes WHERE id = ?').get(Number(solicitudId));
    if (!s) return null;
    const now = new Date().toISOString();
    this.db.prepare('UPDATE solicitudes SET estado = ?, satisfechaAt = ? WHERE id = ?').run('satisfecha', now, Number(solicitudId));
    return new Solicitud({ ...s, estado: 'satisfecha', satisfechaAt: now });
  }
}

module.exports = SolicitudRepository;
