module.exports = class Book {
  constructor({ id, codigo_inventario, name, author, location = null, alta_demanda = false, createdAt = null }) {
    this.id = id != null ? String(id) : null;
    this.codigo_inventario = codigo_inventario;
    this.name = name;
    this.author = author;
    this.location = location;
    this.alta_demanda = !!alta_demanda;
    this.createdAt = createdAt || new Date().toISOString();
  }
};
