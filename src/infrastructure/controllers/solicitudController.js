const express = require('express');

function makeSolicitudController({ solicitudService, solicitudRepo }) {
  const router = express.Router();

  router.post('/', (req, res, next) => {
    try {
      const { student_id, book_id } = req.body;
      if (!student_id || !book_id) return res.status(400).json({ error: 'student_id and book_id required' });
      const sol = solicitudService.createSolicitud({ student_id, book_id });
      if (!sol) return res.status(404).json({ error: 'student or book not found' });
      res.status(201).json(sol);
    } catch (err) { next(err); }
  });

  router.get('/:bookId', (req, res, next) => {
    try {
      const list = solicitudRepo.findActiveByBook(req.params.bookId);
      res.json(list);
    } catch (err) { next(err); }
  });

  return router;
}

module.exports = makeSolicitudController;
