const express = require('express');
const { initDatabase } = require('./src/database/init');
const booksRouter = require('./src/routes/books');
const studentsRouter = require('./src/routes/students');
const loansRouter = require('./src/routes/loans');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

initDatabase();

app.get('/', (req, res) => {
  res.json({
    message: 'API Biblioteca - usa /books, /students, /loans. SQLite persistente.'
  });
});

app.use('/books', booksRouter);
app.use('/students', studentsRouter);
app.use('/loans', loansRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'not found' });
});

app.listen(PORT, () => {
  console.log(`Biblioteca API escuchando en http://localhost:${PORT}`);
});
