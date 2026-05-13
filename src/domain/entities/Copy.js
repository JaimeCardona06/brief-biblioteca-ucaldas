module.exports = class Copy {
  constructor({ id, code, book_id, state = 'disponible', notas = null, reservedUntil = null }) {
    this.id = Number(id);
    this.code = code;
    this.book_id = Number(book_id);
    this.state = state;
    this.notas = notas;
    this.reservedUntil = reservedUntil;
  }
};
