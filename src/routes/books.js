const { Router } = require('express');
const bookRepo = require('../models/book.repository');
const loanRepo = require('../models/loan.repository');

const router = Router();

router.post('/', (req, res) => {
  const { title, author, isbn, copies } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });
  const book = bookRepo.create({ title, author, isbn, copies });
  res.status(201).json(book);
});

router.get('/', (req, res) => {
  res.json(bookRepo.findAll());
});

router.get('/:id', (req, res) => {
  const book = bookRepo.findById(req.params.id);
  if (!book) return res.status(404).json({ error: 'book not found' });
  res.json(book);
});

router.put('/:id', (req, res) => {
  const book = bookRepo.findById(req.params.id);
  if (!book) return res.status(404).json({ error: 'book not found' });
  const updated = bookRepo.update(Number(req.params.id), req.body);
  res.json(updated);
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const book = bookRepo.findById(id);
  if (!book) return res.status(404).json({ error: 'book not found' });
  if (loanRepo.hasActiveLoansByBook(id)) {
    return res.status(400).json({ error: 'cannot delete book with active loans' });
  }
  bookRepo.remove(id);
  res.json({ message: 'book removed' });
});

router.get('/:id/loans', (req, res) => {
  const book = bookRepo.findById(req.params.id);
  if (!book) return res.status(404).json({ error: 'book not found' });
  res.json(loanRepo.getLoansByBook(book.id));
});

module.exports = router;
