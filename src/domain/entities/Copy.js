module.exports = class Copy {
  constructor({ id, code, book_id, state = 'disponible', notas = null, reservedUntil = null }) {
    this.id = id != null ? String(id) : null;
    this.code = code;
    this.book_id = book_id != null ? String(book_id) : null;
    this.state = state;
    this.notas = notas;
    this.reservedUntil = reservedUntil;
  }
};
