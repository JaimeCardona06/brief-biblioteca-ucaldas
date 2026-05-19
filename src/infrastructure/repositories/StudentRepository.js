const Student = require('../../domain/entities/Student');

class StudentRepository {
  constructor({ db }) {
    this.db = db;
  }

  create({ id, code, name, program_id, tipo = 'pregrado' }) {
    const student = new Student({ id: id || code, code, name, program_id: program_id || null, tipo, multas_pendientes: 0 });
    this.db.prepare(`
      INSERT INTO estudiantes (id, code, name, program_id, tipo, multas_pendientes)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(student.id, student.code, student.name, student.program_id, student.tipo, student.multas_pendientes);
    return student;
  }

  findById(id) {
    const row = this.db.prepare('SELECT * FROM estudiantes WHERE id = ?').get(String(id));
    if (!row) return null;
    return new Student({
      id: row.id,
      code: row.code,
      name: row.name,
      program_id: row.program_id,
      tipo: row.tipo,
      multas_pendientes: row.multas_pendientes
    });
  }

  findByCode(code) {
    const row = this.db.prepare('SELECT * FROM estudiantes WHERE code = ?').get(code);
    if (!row) return null;
    return new Student({
      id: row.id,
      code: row.code,
      name: row.name,
      program_id: row.program_id,
      tipo: row.tipo,
      multas_pendientes: row.multas_pendientes
    });
  }

  update(student) {
    this.db.prepare(`
      UPDATE estudiantes SET code = ?, name = ?, program_id = ?, tipo = ?, multas_pendientes = ? WHERE id = ?
    `).run(student.code, student.name, student.program_id, student.tipo, student.multas_pendientes, student.id);
    return student;
  }
}

module.exports = StudentRepository;
