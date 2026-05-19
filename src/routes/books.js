const { Router } = require('express');
const bookRepo = require('../models/book.repository');
const loanRepo = require('../models/loan.repository');

const router = Router();

router.post('/', (req, res) => {
  const { id, titulo, autor, sala, altaDemanda } = req.body;
  if (!id) return res.status(400).json({ error: 'id is required' });
  if (!titulo) return res.status(400).json({ error: 'titulo is required' });

  const exists = bookRepo.findById(id);
  if (exists) return res.status(409).json({ error: 'ya existe un libro con ese id' });

  const book = bookRepo.create({ id, titulo, autor, sala, altaDemanda });
  res.status(201).json(book);
});

router.get('/', (req, res) => {
  res.json(bookRepo.findAll());
});

router.get('/:id', (req, res) => {
  const book = bookRepo.findById(req.params.id);
  if (!book) return res.status(404).json({ error: 'libro no encontrado' });
  res.json(book);
});

router.put('/:id', (req, res) => {
  const book = bookRepo.findById(req.params.id);
  if (!book) return res.status(404).json({ error: 'libro no encontrado' });
  const updated = bookRepo.update(req.params.id, req.body);
  res.json(updated);
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  const book = bookRepo.findById(id);
  if (!book) return res.status(404).json({ error: 'libro no encontrado' });
  if (loanRepo.hasActiveLoansByBook(id)) {
    return res.status(400).json({ error: 'no se puede eliminar un libro con préstamos activos' });
  }
  bookRepo.remove(id);
  res.json({ message: 'libro eliminado' });
});

router.get('/:id/prestamos', (req, res) => {
  const book = bookRepo.findById(req.params.id);
  if (!book) return res.status(404).json({ error: 'libro no encontrado' });
  res.json(loanRepo.getLoansByBook(book.id));
});

module.exports = router;
