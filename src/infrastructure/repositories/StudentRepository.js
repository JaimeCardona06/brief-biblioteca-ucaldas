const Student = require('../../domain/entities/Student');

class StudentRepository {
  constructor() {
    this.items = [];
    this.nextId = 1;
  }

  create({ code, name, program_id, tipo = 'pregrado' }) {
    const student = new Student({ id: this.nextId++, code, name, program_id, tipo, multas_pendientes: 0 });
    this.items.push(student);
    return student;
  }

  findById(id) {
    return this.items.find(s => s.id === Number(id)) || null;
  }

  findByCode(code) {
    return this.items.find(s => s.code === code) || null;
  }

  update(student) {
    const idx = this.items.findIndex(s => s.id === student.id);
    if (idx === -1) return null;
    this.items[idx] = student;
    return student;
  }
}

module.exports = StudentRepository;
