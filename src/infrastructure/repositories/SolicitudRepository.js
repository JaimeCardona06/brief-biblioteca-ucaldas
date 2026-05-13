const Solicitud = require('../../domain/entities/Solicitud');

class SolicitudRepository {
  constructor() {
    this.items = [];
    this.nextId = 1;
  }

  create({ student_id, book_id }) {
    const existing = this.items.find(s => s.book_id === Number(book_id) && s.student_id === Number(student_id) && s.estado === 'activa');
    if (existing) return existing;
    const sol = new Solicitud({ id: this.nextId++, student_id, book_id });
    this.items.push(sol);
    return sol;
  }

  findActiveByBook(bookId) {
    return this.items.filter(s => s.book_id === Number(bookId) && s.estado === 'activa').sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  markSatisfied(solicitudId) {
    const s = this.items.find(x => x.id === Number(solicitudId));
    if (!s) return null;
    s.estado = 'satisfecha';
    s.satisfechaAt = new Date().toISOString();
    return s;
  }
}

module.exports = SolicitudRepository;
