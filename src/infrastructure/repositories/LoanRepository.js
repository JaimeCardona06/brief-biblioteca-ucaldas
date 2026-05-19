const Loan = require('../../domain/entities/Loan');

class LoanRepository {
  constructor({ db }) {
    this.db = db;
  }

  create(data) {
    const stmt = this.db.prepare(`
      INSERT INTO prestamos (student_id, copy_id, fecha_prestamo, fecha_devolucion_esperada, fecha_devolucion_real, estado, renovaciones, original_plazo_days)
      VALUES (@student_id, @copy_id, @fecha_prestamo, @fecha_devolucion_esperada, @fecha_devolucion_real, @estado, @renovaciones, @original_plazo_days)
    `);
    const info = stmt.run({
      student_id: String(data.student_id),
      copy_id: String(data.copy_id),
      fecha_prestamo: data.fecha_prestamo,
      fecha_devolucion_esperada: data.fecha_devolucion_esperada,
      fecha_devolucion_real: data.fecha_devolucion_real,
      estado: data.estado || 'activo',
      renovaciones: data.renovaciones || 0,
      original_plazo_days: data.originalPlazoDays
    });
    return new Loan({
      id: info.lastInsertRowid,
      student_id: data.student_id,
      copy_id: data.copy_id,
      fecha_prestamo: data.fecha_prestamo,
      fecha_devolucion_esperada: data.fecha_devolucion_esperada,
      fecha_devolucion_real: data.fecha_devolucion_real,
      estado: data.estado || 'activo',
      renovaciones: data.renovaciones || 0,
      originalPlazoDays: data.originalPlazoDays
    });
  }

  findById(id) {
    const row = this.db.prepare('SELECT *, original_plazo_days AS originalPlazoDays FROM prestamos WHERE id = ?').get(Number(id));
    if (!row) return null;
    return new Loan(row);
  }

  findByStudent(studentId) {
    const rows = this.db.prepare('SELECT *, original_plazo_days AS originalPlazoDays FROM prestamos WHERE student_id = ?').all(String(studentId));
    return rows.map(row => new Loan(row));
  }

  countActiveByStudent(studentId) {
    const row = this.db.prepare('SELECT COUNT(*) AS count FROM prestamos WHERE student_id = ? AND estado = ?').get(String(studentId), 'activo');
    return row ? row.count : 0;
  }

  listActiveOverdue(now) {
    const rows = this.db.prepare('SELECT *, original_plazo_days AS originalPlazoDays FROM prestamos WHERE estado = ? AND fecha_devolucion_esperada < ?').all('activo', now.toISOString().slice(0, 10));
    return rows.map(row => new Loan(row));
  }

  update(loan) {
    this.db.prepare(`
      UPDATE prestamos SET estado = ?, fecha_devolucion_real = ?, fecha_devolucion_esperada = ?, renovaciones = ? WHERE id = ?
    `).run(loan.estado, loan.fecha_devolucion_real, loan.fecha_devolucion_esperada, loan.renovaciones, loan.id);
    return loan;
  }
}

module.exports = LoanRepository;
