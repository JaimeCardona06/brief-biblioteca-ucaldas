const { Router } = require('express');
const loanRepo = require('../models/loan.repository');
const bookRepo = require('../models/book.repository');
const studentRepo = require('../models/student.repository');

const router = Router();

const DEFAULT_LOAN_DAYS = 14;
const FINE_PER_DAY = 1;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

router.post('/', (req, res) => {
  const { bookId, studentId, loanDays } = req.body;
  if (!bookId || !studentId) return res.status(400).json({ error: 'bookId y studentId son requeridos' });

  const book = bookRepo.findById(bookId);
  if (!book) return res.status(404).json({ error: 'libro no encontrado' });

  const student = studentRepo.findById(studentId);
  if (!student) return res.status(404).json({ error: 'estudiante no encontrado' });

  const now = new Date();
  const days = (Number.isInteger(loanDays) && loanDays > 0) ? loanDays : DEFAULT_LOAN_DAYS;
  const due = new Date(now.getTime() + days * MS_PER_DAY);

  const loan = loanRepo.create({
    bookId: book.id,
    studentId: student.id,
    loanDate: now.toISOString(),
    dueDate: due.toISOString()
  });

  res.status(201).json(loan);
});

router.get('/', (req, res) => {
  const { status } = req.query;
  res.json(loanRepo.findAll(status));
});

router.get('/:id', (req, res) => {
  const loan = loanRepo.findById(req.params.id);
  if (!loan) return res.status(404).json({ error: 'préstamo no encontrado' });
  res.json(loan);
});

router.post('/:id/devolver', (req, res) => {
  const loan = loanRepo.findById(req.params.id);
  if (!loan) return res.status(404).json({ error: 'préstamo no encontrado' });
  if (loan.status !== 'active') return res.status(400).json({ error: 'el préstamo ya fue devuelto' });

  const now = new Date();
  const due = new Date(loan.dueDate);
  const overdueMs = now - due;
  const overdueDays = overdueMs > 0 ? Math.ceil(overdueMs / MS_PER_DAY) : 0;
  const fine = overdueDays > 0 ? overdueDays * FINE_PER_DAY : 0;

  const updated = loanRepo.returnLoan(loan.id, now.toISOString(), fine);

  res.json({ loan: updated, multa: fine });
});

module.exports = router;
