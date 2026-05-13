const Loan = require('../../domain/entities/Loan');

class LoanRepository {
  constructor() {
    this.items = [];
    this.nextId = 1;
  }

  create(data) {
    const loan = new Loan({ id: this.nextId++, ...data });
    this.items.push(loan);
    return loan;
  }

  findById(id) {
    return this.items.find(l => l.id === Number(id)) || null;
  }

  findByStudent(studentId) {
    return this.items.filter(l => l.student_id === Number(studentId));
  }

  countActiveByStudent(studentId) {
    return this.items.filter(l => l.student_id === Number(studentId) && l.estado === 'activo').length;
  }

  listActiveOverdue(now = new Date()) {
    return this.items.filter(l => l.estado === 'activo' && new Date(l.fecha_devolucion_esperada) < now);
  }

  update(loan) {
    const idx = this.items.findIndex(l => l.id === loan.id);
    if (idx === -1) return null;
    this.items[idx] = loan;
    return loan;
  }
}

module.exports = LoanRepository;
