const Database = require('better-sqlite3');
const path = require('path');

let instance = null;

function getDatabase() {
  if (!instance) {
    instance = new Database(path.join(__dirname, '../../database/biblioteca.db'));
    instance.pragma('journal_mode = WAL');
    instance.pragma('foreign_keys = ON');
  }
  return instance;
}

module.exports = { getDatabase };
