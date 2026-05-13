const express = require('express');

function makeCopyController({ copyService }) {
  const router = express.Router();

  router.post('/', (req, res, next) => {
    try {
      const { book_id, code } = req.body;
      if (!book_id || !code) return res.status(400).json({ error: 'book_id and code required' });
      const copy = copyService.createCopy({ book_id, code });
      if (!copy) return res.status(404).json({ error: 'book not found' });
      res.status(201).json(copy);
    } catch (err) {
      if (err.message === 'copy_code_exists') return res.status(409).json({ error: 'copy_code_exists' });
      next(err);
    }
  });

  router.get('/:id', (req, res, next) => {
    try {
      const copy = copyService.getCopy(req.params.id);
      if (!copy) return res.status(404).json({ error: 'copy not found' });
      res.json(copy);
    } catch (err) { next(err); }
  });

  return router;
}

module.exports = makeCopyController;
