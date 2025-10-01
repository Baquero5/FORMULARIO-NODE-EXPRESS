const express = require('express');
const router = express.Router();
const { Persona } = require('../models');
const { body, validationResult } = require('express-validator');

// lista de ciudades ejemplo (puedes modificar)
const ciudades = ['Quito','Guayaquil','Cuenca','Ambato','Manta'];

// reglas de validación (server-side)
const personaValidations = [
  body('dni')
    .trim()
    .isLength({ min: 7, max: 10 }).withMessage('DNI entre 7 y 10 dígitos')
    .isNumeric().withMessage('DNI sólo números'),
  body('nombres')
    .trim()
    .isLength({ min: 2 }).withMessage('Nombre muy corto')
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/).withMessage('Nombre solo letras y espacios'),
  body('apellidos')
    .trim()
    .isLength({ min: 2 }).withMessage('Apellido muy corto')
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/).withMessage('Apellido solo letras y espacios'),
  body('fechaNacimiento')
    .isDate().withMessage('Fecha inválida')
    .custom((value) => {
      const hoy = new Date();
      const fecha = new Date(value);
      if (fecha >= hoy) throw new Error('La fecha debe ser anterior a hoy');
      return true;
    }),
  body('genero').isIn(['M','F','O']).withMessage('Género inválido'),
  body('ciudad').notEmpty().withMessage('Seleccione una ciudad')
];

// LISTAR
router.get('/', async (req, res) => {
  const personas = await Persona.findAll({ order: [['createdAt','DESC']] });
  res.render('index', { personas });
});

// FORM CREAR
router.get('/personas/new', (req, res) => {
  res.render('form', { persona: null, errors: {}, ciudades });
});

// CREAR (POST)
router.post('/personas', personaValidations, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const mapped = errors.mapped();
    return res.render('form', { persona: req.body, errors: mapped, ciudades });
  }
  await Persona.create(req.body);
  res.redirect('/');
});

// FORM EDITAR
router.get('/personas/:id/edit', async (req, res) => {
  const persona = await Persona.findByPk(req.params.id);
  if (!persona) return res.redirect('/');
  res.render('form', { persona, errors: {}, ciudades });
});

// ACTUALIZAR (PUT)
router.put('/personas/:id', personaValidations, async (req, res) => {
  const errors = validationResult(req);
  const persona = await Persona.findByPk(req.params.id);
  if (!errors.isEmpty()) {
    return res.render('form', { persona: { ...req.body, id: req.params.id }, errors: errors.mapped(), ciudades });
  }
  if (persona) {
    await persona.update(req.body);
  }
  res.redirect('/');
});

// BORRAR (DELETE)
router.delete('/personas/:id', async (req, res) => {
  const persona = await Persona.findByPk(req.params.id);
  if (persona) await persona.destroy();
  res.redirect('/');
});

module.exports = router;
