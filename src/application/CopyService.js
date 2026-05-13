class CopyService {
  constructor({ copyRepo, bookRepo }) {
    this.copyRepo = copyRepo;
    this.bookRepo = bookRepo;
  }

  createCopy({ book_id, code }) {
    const book = this.bookRepo.findById(book_id);
    if (!book) return null;
    return this.copyRepo.create({ book_id, code });
  }

  getCopy(id) {
    return this.copyRepo.findById(id);
  }
}

module.exports = CopyService;
