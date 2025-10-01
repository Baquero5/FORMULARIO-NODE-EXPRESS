const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const { sequelize } = require('./models');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// routes
const personasRouter = require('./routes/personas');
app.use('/', personasRouter);

// sincronizar DB y levantar servidor
const PORT = process.env.PORT || 3000;
sequelize.sync()
  .then(() => {
    console.log('DB sincronizada');
    app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
  })
  .catch(err => console.error('Error al sincronizar DB:', err));
