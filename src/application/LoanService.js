const { BadRequest, NotFound, Conflict } = require('../domain/errors');
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const FINE_RATE = 2000; // COP per day
const MAX_RENOVACIONES = 1;

class LoanService {
  constructor({ studentRepo, copyRepo, bookRepo, loanRepo, fineRepo, solicitudRepo }) {
    this.studentRepo = studentRepo;
    this.copyRepo = copyRepo;
    this.bookRepo = bookRepo;
    this.loanRepo = loanRepo;
    this.fineRepo = fineRepo;
    this.solicitudRepo = solicitudRepo;
  }

  createLoan({ student_id, copy_id, fecha_prestamo = null }) {
    const student = this.studentRepo.findById(student_id);
    if (!student) throw new NotFound('student not found');
    const copy = this.copyRepo.findById(copy_id);
    if (!copy) throw new NotFound('copy not found');

    if (copy.state !== 'disponible') throw new Conflict('ejemplar_no_disponible');

    // RN2: bloqueo por multas o prestamos vencidos
    const unpaid = this.fineRepo.sumUnpaidByStudent(student.id);
    const hasVencidos = this.loanRepo.findByStudent(student.id).some(l => l.estado === 'vencido');
    if (unpaid > 0 || hasVencidos) throw new Conflict('bloqueado_por_multas_o_vencidos');

    // RN1: limite por tipo
    const activos = this.loanRepo.countActiveByStudent(student.id);
    const limite = student.tipo === 'posgrado' ? 5 : 3;
    if (activos >= limite) throw new Conflict('limite_prestamos_alcanzado');

    // RN3: plazo
    const book = this.bookRepo.findById(copy.book_id);
    const plazo = book && book.alta_demanda ? 3 : 15;

    const now = fecha_prestamo ? new Date(fecha_prestamo) : new Date();
    const due = new Date(now.getTime() + plazo * MS_PER_DAY);

    const loan = this.loanRepo.create({
      student_id: student.id,
      copy_id: copy.id,
      fecha_prestamo: now.toISOString().slice(0, 10),
      fecha_devolucion_esperada: due.toISOString().slice(0, 10),
      fecha_devolucion_real: null,
      estado: 'activo',
      renovaciones: 0,
      originalPlazoDays: plazo
    });

    // mark copy as prestado
    copy.state = 'prestado';
    this.copyRepo.update(copy);

    return loan;
  }

  renewLoan(loanId) {
    const loan = this.loanRepo.findById(loanId);
    if (!loan) throw new NotFound('loan not found');
    if (loan.estado !== 'activo') throw new Conflict('renovacion_no_permitida');

    const now = new Date();
    const due = new Date(loan.fecha_devolucion_esperada + 'T00:00:00Z');
    if (due < now) {
      loan.estado = 'vencido';
      this.loanRepo.update(loan);
      throw new Conflict('renovacion_no_permitida');
    }

    if (loan.renovaciones >= MAX_RENOVACIONES) throw new Conflict('renovacion_no_permitida');

    const copy = this.copyRepo.findById(loan.copy_id);
    const book = this.bookRepo.findById(copy.book_id);
    const solicitudes = this.solicitudRepo.findActiveByBook(book.id);
    if (solicitudes.length > 0) throw new Conflict('renovacion_no_permitida');

    const addMs = loan.originalPlazoDays * MS_PER_DAY;
    const newDue = new Date(new Date(loan.fecha_devolucion_esperada + 'T00:00:00Z').getTime() + addMs);
    loan.fecha_devolucion_esperada = newDue.toISOString().slice(0, 10);
    loan.renovaciones += 1;
    this.loanRepo.update(loan);
    return loan;
  }

  returnLoan({ prestamo_id, fecha_devolucion = null }) {
    const loan = this.loanRepo.findById(prestamo_id);
    if (!loan) throw new NotFound('loan not found');
    if (loan.estado !== 'activo') throw new Conflict('loan_not_active');

    const now = fecha_devolucion ? new Date(fecha_devolucion) : new Date();
    loan.fecha_devolucion_real = now.toISOString().slice(0, 10);

    const due = new Date(loan.fecha_devolucion_esperada + 'T00:00:00Z');
    const overdueMs = now - due;
    const overdueDays = overdueMs > 0 ? Math.ceil(overdueMs / MS_PER_DAY) : 0;

    let multa = null;
    if (overdueDays > 0) {
      const monto = overdueDays * FINE_RATE;
      multa = this.fineRepo.create({ prestamo_id: loan.id, student_id: loan.student_id, dias_atraso: overdueDays, monto, pagada: false });
      const student = this.studentRepo.findById(loan.student_id);
      if (student) {
        student.multas_pendientes = (student.multas_pendientes || 0) + monto;
        this.studentRepo.update(student);
      }
    }

    loan.estado = 'devuelto';
    this.loanRepo.update(loan);

    const copy = this.copyRepo.findById(loan.copy_id);
    const book = this.bookRepo.findById(copy.book_id);
    const solicitudes = this.solicitudRepo.findActiveByBook(book.id);
    if (solicitudes.length > 0) {
      const first = solicitudes[0];
      this.solicitudRepo.markSatisfied(first.id);
      const reservedUntil = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
      copy.state = 'reservado';
      copy.reservedUntil = reservedUntil;
    } else {
      copy.state = 'disponible';
      copy.reservedUntil = null;
    }
    this.copyRepo.update(copy);

    return { loan, multa };
  }

  listOverdue() {
    return this.loanRepo.listActiveOverdue(new Date());
  }
}

module.exports = LoanService;
