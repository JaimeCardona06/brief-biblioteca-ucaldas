const Book = require('../../domain/entities/Book');

class BookRepository {
  constructor() {
    this.items = [];
    this.nextId = 1;
  }

  create(data) {
    const book = new Book({ id: this.nextId++, ...data });
    this.items.push(book);
    return book;
  }

  findById(id) {
    return this.items.find(b => b.id === Number(id)) || null;
  }

  list() {
    return [...this.items];
  }
}

module.exports = BookRepository;
