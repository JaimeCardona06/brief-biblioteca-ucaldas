const { Router } = require('express');
const studentRepo = require('../models/student.repository');
const loanRepo = require('../models/loan.repository');

const router = Router();

router.post('/', (req, res) => {
  const { name, email } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  const student = studentRepo.create({ name, email });
  res.status(201).json(student);
});

router.get('/', (req, res) => {
  res.json(studentRepo.findAll());
});

router.get('/:id', (req, res) => {
  const student = studentRepo.findById(req.params.id);
  if (!student) return res.status(404).json({ error: 'estudiante no encontrado' });
  res.json(student);
});

router.put('/:id', (req, res) => {
  const student = studentRepo.findById(req.params.id);
  if (!student) return res.status(404).json({ error: 'estudiante no encontrado' });
  const updated = studentRepo.update(Number(req.params.id), req.body);
  res.json(updated);
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const student = studentRepo.findById(id);
  if (!student) return res.status(404).json({ error: 'estudiante no encontrado' });
  if (loanRepo.hasActiveLoansByStudent(id)) {
    return res.status(400).json({ error: 'no se puede eliminar un estudiante con préstamos activos' });
  }
  studentRepo.remove(id);
  res.json({ message: 'estudiante eliminado' });
});

router.get('/:id/multas', (req, res) => {
  const student = studentRepo.findById(req.params.id);
  if (!student) return res.status(404).json({ error: 'estudiante no encontrado' });
  const fines = loanRepo.getFinesByStudent(student.id);
  res.json({ studentId: student.id, ...fines });
});

router.get('/:id/prestamos', (req, res) => {
  const student = studentRepo.findById(req.params.id);
  if (!student) return res.status(404).json({ error: 'estudiante no encontrado' });
  res.json(loanRepo.getLoansByStudent(student.id));
});

module.exports = router;
