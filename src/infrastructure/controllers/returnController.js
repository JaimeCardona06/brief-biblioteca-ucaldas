const express = require('express');

function makeReturnController({ loanService }) {
  const router = express.Router();

  router.post('/', (req, res, next) => {
    try {
      const { prestamo_id, fecha_devolucion } = req.body;
      if (!prestamo_id) return res.status(400).json({ error: 'prestamo_id required' });
      const result = loanService.returnLoan({ prestamo_id, fecha_devolucion });
      res.json(result);
    } catch (err) { next(err); }
  });

  return router;
}

module.exports = makeReturnController;
