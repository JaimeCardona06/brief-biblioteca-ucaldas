module.exports = class Fine {
  constructor({ id, prestamo_id, student_id, dias_atraso, monto, pagada = false, fecha_generada = null }) {
    this.id = Number(id);
    this.prestamo_id = Number(prestamo_id);
    this.student_id = student_id != null ? String(student_id) : null;
    this.dias_atraso = Number(dias_atraso);
    this.monto = Number(monto);
    this.pagada = !!pagada;
    this.fecha_generada = fecha_generada || new Date().toISOString();
  }
};
