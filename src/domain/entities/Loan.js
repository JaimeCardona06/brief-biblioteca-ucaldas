module.exports = class Loan {
  constructor({ id, student_id, copy_id, fecha_prestamo, fecha_devolucion_esperada, fecha_devolucion_real = null, estado = 'activo', renovaciones = 0, originalPlazoDays = null }) {
    this.id = Number(id);
    this.student_id = Number(student_id);
    this.copy_id = Number(copy_id);
    this.fecha_prestamo = fecha_prestamo;
    this.fecha_devolucion_esperada = fecha_devolucion_esperada;
    this.fecha_devolucion_real = fecha_devolucion_real;
    this.estado = estado;
    this.renovaciones = Number(renovaciones) || 0;
    this.originalPlazoDays = originalPlazoDays != null ? Number(originalPlazoDays) : null;
  }
};
