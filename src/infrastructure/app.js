const express = require('express');

// Repositories
const BookRepository = require('./repositories/BookRepository');
const CopyRepository = require('./repositories/CopyRepository');
const StudentRepository = require('./repositories/StudentRepository');
const LoanRepository = require('./repositories/LoanRepository');
const FineRepository = require('./repositories/FineRepository');
const SolicitudRepository = require('./repositories/SolicitudRepository');

// Services
const BookService = require('../application/BookService');
const CopyService = require('../application/CopyService');
const StudentService = require('../application/StudentService');
const LoanService = require('../application/LoanService');
const SolicitudService = require('../application/SolicitudService');

// Controllers
const makeBookController = require('./controllers/bookController');
const makeCopyController = require('./controllers/copyController');
const makeStudentController = require('./controllers/studentController');
const makeLoanController = require('./controllers/loanController');
const makeReturnController = require('./controllers/returnController');
const makeSolicitudController = require('./controllers/solicitudController');

const { AppError } = require('../domain/errors');

function createApp() {
  const app = express();
  app.use(express.json());

  // Instantiate repositories
  const bookRepo = new BookRepository();
  const copyRepo = new CopyRepository();
  const studentRepo = new StudentRepository();
  const loanRepo = new LoanRepository();
  const fineRepo = new FineRepository();
  const solicitudRepo = new SolicitudRepository();

  // Instantiate services with DI
  const bookService = new BookService({ bookRepo, copyRepo });
  const copyService = new CopyService({ copyRepo, bookRepo });
  const studentService = new StudentService({ studentRepo, loanRepo });
  const loanService = new LoanService({ studentRepo, copyRepo, bookRepo, loanRepo, fineRepo, solicitudRepo });
  const solicitudService = new SolicitudService({ solicitudRepo, bookRepo, studentRepo });

  // Wire routes
  app.use('/libros', makeBookController({ bookService, copyRepo }));
  app.use('/ejemplares', makeCopyController({ copyService }));
  app.use('/estudiantes', makeStudentController({ studentService }));
  app.use('/prestamos', makeLoanController({ loanService }));
  app.use('/devoluciones', makeReturnController({ loanService }));
  app.use('/solicitudes', makeSolicitudController({ solicitudService, solicitudRepo }));

  // 404
  app.use((req, res) => {
    res.status(404).json({ error: 'not found' });
  });

  // Error handler (centralizado)
  app.use((err, req, res, next) => {
    if (err instanceof AppError || (err && err.status)) {
      const status = err.status || 500;
      return res.status(status).json({ error: err.code || 'error', message: err.message });
    }
    console.error(err);
    res.status(500).json({ error: 'internal_server_error', message: String(err && err.message ? err.message : err) });
  });

  return app;
}

module.exports = createApp;
