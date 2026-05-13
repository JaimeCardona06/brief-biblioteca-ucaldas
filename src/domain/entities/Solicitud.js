module.exports = class Solicitud {
  constructor({ id, student_id, book_id, estado = 'activa', createdAt = null, satisfechaAt = null }) {
    this.id = Number(id);
    this.student_id = Number(student_id);
    this.book_id = Number(book_id);
    this.estado = estado;
    this.createdAt = createdAt || new Date().toISOString();
    this.satisfechaAt = satisfechaAt;
  }
};
