const Fine = require('../../domain/entities/Fine');

class FineRepository {
  constructor({ db }) {
    this.db = db;
  }

  create(data) {
    const stmt = this.db.prepare(`
      INSERT INTO multas (prestamo_id, student_id, dias_atraso, monto, pagada, fecha_generada)
      VALUES (@prestamo_id, @student_id, @dias_atraso, @monto, @pagada, @fecha_generada)
    `);
    const info = stmt.run({
      prestamo_id: data.prestamo_id,
      student_id: String(data.student_id),
      dias_atraso: data.dias_atraso,
      monto: data.monto,
      pagada: data.pagada ? 1 : 0,
      fecha_generada: data.fecha_generada || new Date().toISOString()
    });
    return new Fine({
      id: info.lastInsertRowid,
      prestamo_id: data.prestamo_id,
      student_id: data.student_id,
      dias_atraso: data.dias_atraso,
      monto: data.monto,
      pagada: data.pagada,
      fecha_generada: data.fecha_generada
    });
  }

  findByStudentUnpaid(studentId) {
    const rows = this.db.prepare('SELECT * FROM multas WHERE student_id = ? AND pagada = 0').all(String(studentId));
    return rows.map(row => new Fine({
      id: row.id,
      prestamo_id: row.prestamo_id,
      student_id: row.student_id,
      dias_atraso: row.dias_atraso,
      monto: row.monto,
      pagada: !!row.pagada,
      fecha_generada: row.fecha_generada
    }));
  }

  sumUnpaidByStudent(studentId) {
    const row = this.db.prepare('SELECT COALESCE(SUM(monto), 0) AS total FROM multas WHERE student_id = ? AND pagada = 0').get(String(studentId));
    return row ? row.total : 0;
  }
}

module.exports = FineRepository;
