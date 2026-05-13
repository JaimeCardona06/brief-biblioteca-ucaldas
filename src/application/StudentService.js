class StudentService {
  constructor({ studentRepo, loanRepo }) {
    this.studentRepo = studentRepo;
    this.loanRepo = loanRepo;
  }

  createStudent(payload) {
    return this.studentRepo.create(payload);
  }

  getActiveLoans(studentId) {
    return this.loanRepo.findByStudent(Number(studentId)).filter(l => l.estado === 'activo');
  }

  getLoanHistory(studentId) {
    return this.loanRepo.findByStudent(Number(studentId));
  }
}

module.exports = StudentService;
