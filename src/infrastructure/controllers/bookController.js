const express = require('express');

function makeBookController({ bookService, copyRepo }) {
  const router = express.Router();

  router.post('/', (req, res, next) => {
    try {
      const { codigo_inventario, name, author, location, alta_demanda } = req.body;
      if (!codigo_inventario || !name || !author) return res.status(400).json({ error: 'codigo_inventario, name and author required' });
      const book = bookService.createBook({ codigo_inventario, name, author, location, alta_demanda });
      res.status(201).json(book);
    } catch (err) { next(err); }
  });

  router.get('/', (req, res, next) => {
    try {
      const result = bookService.list(req.query);
      res.json(result);
    } catch (err) { next(err); }
  });

  router.get('/:id', (req, res, next) => {
    try {
      const book = bookService.getBook(req.params.id);
      if (!book) return res.status(404).json({ error: 'book not found' });
      const copies = copyRepo.findByBook(book.id);
      res.json({ ...book, copies });
    } catch (err) { next(err); }
  });

  return router;
}

module.exports = makeBookController;
