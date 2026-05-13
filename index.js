// Bootstrap the application (Clean Architecture / Hexagonal)
const createApp = require('./src/infrastructure/app');

const PORT = process.env.PORT || 3000;
const app = createApp();

app.listen(PORT, () => {
  console.log(`Biblioteca API (hexagonal) escuchando en http://localhost:${PORT}`);
});
