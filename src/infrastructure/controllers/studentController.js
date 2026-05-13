const express = require('express');

function makeStudentController({ studentService }) {
  const router = express.Router();

  router.post('/', (req, res, next) => {
    try {
      const { code, name, program_id, tipo } = req.body;
      if (!code || !name || !program_id) return res.status(400).json({ error: 'code, name, program_id required' });
      const student = studentService.createStudent({ code, name, program_id, tipo });
      res.status(201).json(student);
    } catch (err) { next(err); }
  });

  router.get('/:id/prestamos', (req, res, next) => {
    try {
      const loans = studentService.getActiveLoans(req.params.id);
      res.json(loans);
    } catch (err) { next(err); }
  });

  router.get('/:id/historial', (req, res, next) => {
    try {
      const loans = studentService.getLoanHistory(req.params.id);
      res.json(loans);
    } catch (err) { next(err); }
  });

  return router;
}

module.exports = makeStudentController;
