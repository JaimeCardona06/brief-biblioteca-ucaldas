const Fine = require('../../domain/entities/Fine');

class FineRepository {
  constructor() {
    this.items = [];
    this.nextId = 1;
  }

  create(data) {
    const fine = new Fine({ id: this.nextId++, ...data });
    this.items.push(fine);
    return fine;
  }

  findByStudentUnpaid(studentId) {
    return this.items.filter(f => f.student_id === Number(studentId) && !f.pagada);
  }

  sumUnpaidByStudent(studentId) {
    return this.findByStudentUnpaid(studentId).reduce((s, f) => s + f.monto, 0);
  }
}

module.exports = FineRepository;
