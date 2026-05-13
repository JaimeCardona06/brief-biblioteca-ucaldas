const express = require('express');

function makeLoanController({ loanService }) {
  const router = express.Router();

  router.post('/', (req, res, next) => {
    try {
      const { student_id, copy_id, fecha_prestamo } = req.body;
      if (!student_id || !copy_id) return res.status(400).json({ error: 'student_id and copy_id required' });
      const loan = loanService.createLoan({ student_id, copy_id, fecha_prestamo });
      res.status(201).json(loan);
    } catch (err) { next(err); }
  });

  router.post('/:id/renovar', (req, res, next) => {
    try {
      const loan = loanService.renewLoan(req.params.id);
      res.json(loan);
    } catch (err) { next(err); }
  });

  router.get('/vencidos', (req, res, next) => {
    try {
      const list = loanService.listOverdue();
      res.json(list);
    } catch (err) { next(err); }
  });

  return router;
}

module.exports = makeLoanController;
