// Biblioteca API (datos en memoria)
const express = require('express');
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

// In-memory stores
const books = [];      // { id, title, author, isbn, copies, createdAt }
const students = [];   // { id, name, email, createdAt }
const loans = [];      // { id, bookId, studentId, loanDate, dueDate, returnDate|null, fine, status }

let nextBookId = 1;
let nextStudentId = 1;
let nextLoanId = 1;

const DEFAULT_LOAN_DAYS = 14;
const FINE_PER_DAY = 1; // unidades monetarias por día de retraso
const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Helpers
function findBook(id) {
  return books.find(b => b.id === Number(id));
}

function findStudent(id) {
  return students.find(s => s.id === Number(id));
}

function findLoan(id) {
  return loans.find(l => l.id === Number(id));
}

// Root
app.get('/', (req, res) => {
  res.json({
    message: 'API Biblioteca - usa /books, /students, /loans. Datos en memoria (no persistentes).'
  });
});

// -----------------------
// Books
// -----------------------
app.post('/books', (req, res) => {
  const { title, author, isbn, copies } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });

  const book = {
    id: nextBookId++,
    title,
    author: author || null,
    isbn: isbn || null,
    copies: Number.isInteger(copies) ? Math.max(0, copies) : 1,
    createdAt: new Date().toISOString()
  };
  books.push(book);
  res.status(201).json(book);
});

app.get('/books', (req, res) => {
  res.json(books);
});

app.get('/books/:id', (req, res) => {
  const book = findBook(req.params.id);
  if (!book) return res.status(404).json({ error: 'book not found' });
  res.json(book);
});

app.put('/books/:id', (req, res) => {
  const book = findBook(req.params.id);
  if (!book) return res.status(404).json({ error: 'book not found' });

  const { title, author, isbn, copies } = req.body;
  if (title !== undefined) book.title = title;
  if (author !== undefined) book.author = author;
  if (isbn !== undefined) book.isbn = isbn;
  if (copies !== undefined && Number.isInteger(copies)) book.copies = Math.max(0, copies);

  res.json(book);
});

app.delete('/books/:id', (req, res) => {
  const id = Number(req.params.id);
  const book = findBook(id);
  if (!book) return res.status(404).json({ error: 'book not found' });

  const hasActiveLoans = loans.some(l => l.bookId === id && l.status === 'active');
  if (hasActiveLoans) return res.status(400).json({ error: 'cannot delete book with active loans' });

  const idx = books.findIndex(b => b.id === id);
  books.splice(idx, 1);
  res.json({ message: 'book removed' });
});

// -----------------------
// Students
// -----------------------
app.post('/students', (req, res) => {
  const { name, email } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });

  const student = {
    id: nextStudentId++,
    name,
    email: email || null,
    createdAt: new Date().toISOString()
  };
  students.push(student);
  res.status(201).json(student);
});

app.get('/students', (req, res) => {
  res.json(students);
});

app.get('/students/:id', (req, res) => {
  const student = findStudent(req.params.id);
  if (!student) return res.status(404).json({ error: 'student not found' });
  res.json(student);
});

app.put('/students/:id', (req, res) => {
  const student = findStudent(req.params.id);
  if (!student) return res.status(404).json({ error: 'student not found' });

  const { name, email } = req.body;
  if (name !== undefined) student.name = name;
  if (email !== undefined) student.email = email;
  res.json(student);
});

app.delete('/students/:id', (req, res) => {
  const id = Number(req.params.id);
  const student = findStudent(id);
  if (!student) return res.status(404).json({ error: 'student not found' });

  const hasActiveLoans = loans.some(l => l.studentId === id && l.status === 'active');
  if (hasActiveLoans) return res.status(400).json({ error: 'cannot delete student with active loans' });

  const idx = students.findIndex(s => s.id === id);
  students.splice(idx, 1);
  res.json({ message: 'student removed' });
});

// -----------------------
// Loans
// -----------------------
// Create a loan: { bookId, studentId, loanDays? }
app.post('/loans', (req, res) => {
  const { bookId, studentId, loanDays } = req.body;
  if (!bookId || !studentId) return res.status(400).json({ error: 'bookId and studentId are required' });

  const book = findBook(bookId);
  if (!book) return res.status(404).json({ error: 'book not found' });

  const student = findStudent(studentId);
  if (!student) return res.status(404).json({ error: 'student not found' });

  if (book.copies < 1) return res.status(400).json({ error: 'no copies available' });

  const now = new Date();
  const days = (Number.isInteger(loanDays) && loanDays > 0) ? loanDays : DEFAULT_LOAN_DAYS;
  const due = new Date(now.getTime() + days * MS_PER_DAY);

  const loan = {
    id: nextLoanId++,
    bookId: book.id,
    studentId: student.id,
    loanDate: now.toISOString(),
    dueDate: due.toISOString(),
    returnDate: null,
    fine: 0,
    status: 'active'
  };

  loans.push(loan);
  // decrement available copies
  book.copies -= 1;

  res.status(201).json(loan);
});

// List loans, optional ?status=active|returned
app.get('/loans', (req, res) => {
  const { status } = req.query;
  if (status) return res.json(loans.filter(l => l.status === status));
  res.json(loans);
});

app.get('/loans/:id', (req, res) => {
  const loan = findLoan(req.params.id);
  if (!loan) return res.status(404).json({ error: 'loan not found' });
  res.json(loan);
});

// Return a loan (calculate fine if overdue)
app.post('/loans/:id/return', (req, res) => {
  const loan = findLoan(req.params.id);
  if (!loan) return res.status(404).json({ error: 'loan not found' });
  if (loan.status !== 'active') return res.status(400).json({ error: 'loan already returned' });

  const now = new Date();
  const due = new Date(loan.dueDate);
  const overdueMs = now - due;
  const overdueDays = overdueMs > 0 ? Math.ceil(overdueMs / MS_PER_DAY) : 0;
  const fine = overdueDays > 0 ? overdueDays * FINE_PER_DAY : 0;

  loan.returnDate = now.toISOString();
  loan.fine = fine;
  loan.status = 'returned';

  // restore book copy
  const book = findBook(loan.bookId);
  if (book) book.copies += 1;

  res.json({ loan, fine });
});

// Student fines summary (sum of returned fines + current overdue from active loans)
app.get('/students/:id/fines', (req, res) => {
  const student = findStudent(req.params.id);
  if (!student) return res.status(404).json({ error: 'student not found' });

  const now = new Date();

  const returnedFines = loans
    .filter(l => l.studentId === student.id && l.status === 'returned')
    .reduce((s, l) => s + (l.fine || 0), 0);

  const activeOverdue = loans
    .filter(l => l.studentId === student.id && l.status === 'active')
    .reduce((s, l) => {
      const due = new Date(l.dueDate);
      const overdueMs = now - due;
      if (overdueMs <= 0) return s;
      const days = Math.ceil(overdueMs / MS_PER_DAY);
      return s + days * FINE_PER_DAY;
    }, 0);

  res.json({ studentId: student.id, returnedFines, activeOverdue, total: returnedFines + activeOverdue });
});

// Student loans
app.get('/students/:id/loans', (req, res) => {
  const student = findStudent(req.params.id);
  if (!student) return res.status(404).json({ error: 'student not found' });
  const sLoans = loans.filter(l => l.studentId === student.id);
  res.json(sLoans);
});

// Book loans
app.get('/books/:id/loans', (req, res) => {
  const book = findBook(req.params.id);
  if (!book) return res.status(404).json({ error: 'book not found' });
  const bLoans = loans.filter(l => l.bookId === book.id);
  res.json(bLoans);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'not found' });
});

app.listen(PORT, () => {
  console.log(`Biblioteca API escuchando en http://localhost:${PORT}`);
});
