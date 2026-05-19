const Book = require('../../domain/entities/Book');

class BookRepository {
  constructor({ db }) {
    this.db = db;
  }

  create(data) {
    const stmt = this.db.prepare(`
      INSERT INTO libros (id, codigo_inventario, name, author, location, alta_demanda, createdAt)
      VALUES (@id, @codigo_inventario, @name, @author, @location, @alta_demanda, @createdAt)
    `);
    const book = new Book({
      id: data.id || data.codigo_inventario,
      codigo_inventario: data.codigo_inventario,
      name: data.name,
      author: data.author,
      location: data.location || null,
      alta_demanda: data.alta_demanda || false,
      createdAt: data.createdAt || new Date().toISOString()
    });
    stmt.run({
      id: book.id,
      codigo_inventario: book.codigo_inventario || null,
      name: book.name,
      author: book.author,
      location: book.location,
      alta_demanda: book.alta_demanda ? 1 : 0,
      createdAt: book.createdAt
    });
    return book;
  }

  findById(id) {
    const row = this.db.prepare('SELECT * FROM libros WHERE id = ?').get(String(id));
    if (!row) return null;
    return new Book({
      id: row.id,
      codigo_inventario: row.codigo_inventario,
      name: row.name,
      author: row.author,
      location: row.location,
      alta_demanda: !!row.alta_demanda,
      createdAt: row.createdAt
    });
  }

  list() {
    const rows = this.db.prepare('SELECT * FROM libros').all();
    return rows.map(row => new Book({
      id: row.id,
      codigo_inventario: row.codigo_inventario,
      name: row.name,
      author: row.author,
      location: row.location,
      alta_demanda: !!row.alta_demanda,
      createdAt: row.createdAt
    }));
  }
}

module.exports = BookRepository;
