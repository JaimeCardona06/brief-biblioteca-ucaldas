const Copy = require('../../domain/entities/Copy');

class CopyRepository {
  constructor() {
    this.items = [];
    this.nextId = 1;
  }

  create({ code, book_id }) {
    const exists = this.items.find(c => c.code === code);
    if (exists) throw new Error('copy_code_exists');
    const copy = new Copy({ id: this.nextId++, code, book_id });
    this.items.push(copy);
    return copy;
  }

  findById(id) {
    return this.items.find(c => c.id === Number(id)) || null;
  }

  findByBook(bookId) {
    return this.items.filter(c => c.book_id === Number(bookId));
  }

  update(copy) {
    const idx = this.items.findIndex(c => c.id === copy.id);
    if (idx === -1) return null;
    this.items[idx] = copy;
    return copy;
  }
}

module.exports = CopyRepository;
