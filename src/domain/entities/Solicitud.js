module.exports = class Solicitud {
  constructor({ id, student_id, book_id, estado = 'activa', createdAt = null, satisfechaAt = null }) {
    this.id = Number(id);
    this.student_id = student_id != null ? String(student_id) : null;
    this.book_id = book_id != null ? String(book_id) : null;
    this.estado = estado;
    this.createdAt = createdAt || new Date().toISOString();
    this.satisfechaAt = satisfechaAt;
  }
};
