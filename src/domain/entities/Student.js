module.exports = class Student {
  constructor({ id, code, name, program_id, tipo = 'pregrado', multas_pendientes = 0 }) {
    this.id = id != null ? String(id) : null;
    this.code = code;
    this.name = name;
    this.program_id = program_id != null ? Number(program_id) : null;
    this.tipo = tipo;
    this.multas_pendientes = Number(multas_pendientes) || 0;
  }
};
