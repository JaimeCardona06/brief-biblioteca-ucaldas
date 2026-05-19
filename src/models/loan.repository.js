const { getDatabase } = require('../database/db');

function findAll(status) {
  if (status) {
    return getDatabase().prepare('SELECT * FROM loans WHERE status = ?').all(status);
  }
  return getDatabase().prepare('SELECT * FROM loans').all();
}

function findById(id) {
  return getDatabase().prepare('SELECT * FROM loans WHERE id = ?').get(id);
}

function create({ bookId, studentId, loanDate, dueDate }) {
  const stmt = getDatabase().prepare(`
    INSERT INTO loans (bookId, studentId, loanDate, dueDate) VALUES (?, ?, ?, ?)
  `);
  const result = stmt.run(bookId, studentId, loanDate, dueDate);
  return findById(result.lastInsertRowid);
}

function returnLoan(id, returnDate, fine) {
  getDatabase().prepare(`
    UPDATE loans SET returnDate = ?, fine = ?, status = 'returned' WHERE id = ?
  `).run(returnDate, fine, id);
  return findById(id);
}

function hasActiveLoansByBook(bookId) {
  const row = getDatabase().prepare(
    'SELECT COUNT(*) AS count FROM loans WHERE bookId = ? AND status = ?'
  ).get(bookId, 'active');
  return row.count > 0;
}

function hasActiveLoansByStudent(studentId) {
  const row = getDatabase().prepare(
    'SELECT COUNT(*) AS count FROM loans WHERE studentId = ? AND status = ?'
  ).get(studentId, 'active');
  return row.count > 0;
}

function getLoansByBook(bookId) {
  return getDatabase().prepare('SELECT * FROM loans WHERE bookId = ?').all(bookId);
}

function getLoansByStudent(studentId) {
  return getDatabase().prepare('SELECT * FROM loans WHERE studentId = ?').all(studentId);
}

function getFinesByStudent(studentId) {
  const returnedFines = getDatabase().prepare(
    "SELECT COALESCE(SUM(fine), 0) AS total FROM loans WHERE studentId = ? AND status = 'returned'"
  ).get(studentId).total;

  const activeLoans = getDatabase().prepare(
    "SELECT dueDate FROM loans WHERE studentId = ? AND status = 'active'"
  ).all(studentId);

  const now = new Date();
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const FINE_PER_DAY = 1;

  let activeOverdue = 0;
  for (const loan of activeLoans) {
    const due = new Date(loan.dueDate);
    const overdueMs = now - due;
    if (overdueMs > 0) {
      activeOverdue += Math.ceil(overdueMs / MS_PER_DAY) * FINE_PER_DAY;
    }
  }

  return { returnedFines, activeOverdue, total: returnedFines + activeOverdue };
}

module.exports = { findAll, findById, create, returnLoan, hasActiveLoansByBook, hasActiveLoansByStudent, getLoansByBook, getLoansByStudent, getFinesByStudent };
