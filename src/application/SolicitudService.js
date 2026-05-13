class SolicitudService {
  constructor({ solicitudRepo, bookRepo, studentRepo }) {
    this.solicitudRepo = solicitudRepo;
    this.bookRepo = bookRepo;
    this.studentRepo = studentRepo;
  }

  createSolicitud({ student_id, book_id }) {
    const student = this.studentRepo.findById(student_id);
    const book = this.bookRepo.findById(book_id);
    if (!student || !book) return null;
    return this.solicitudRepo.create({ student_id, book_id });
  }
}

module.exports = SolicitudService;
