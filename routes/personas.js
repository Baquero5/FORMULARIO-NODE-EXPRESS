const express = require('express');
const router = express.Router();
const { Persona } = require('../models'); // Modelo importado correctamente
const { body, validationResult } = require('express-validator');

// Lista de ciudades ejemplo
const ciudades = ['Quito', 'Guayaquil', 'Cuenca', 'Ambato', 'Manta'];

// Reglas de validación
const personaValidations = [
  body('dni')
    .trim()
    .notEmpty().withMessage('El DNI es obligatorio')
    .isLength({ min: 7, max: 10 }).withMessage('DNI entre 7 y 10 dígitos')
    .isNumeric().withMessage('DNI solo números'),
  body('nombres')
    .trim()
    .notEmpty().withMessage('Los nombres son obligatorios')
    .isLength({ min: 2 }).withMessage('Nombre muy corto')
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/).withMessage('Nombre solo letras y espacios'),
  body('apellidos')
    .trim()
    .notEmpty().withMessage('Los apellidos son obligatorios')
    .isLength({ min: 2 }).withMessage('Apellido muy corto')
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/).withMessage('Apellido solo letras y espacios'),
  body('fechaNacimiento')
    .isDate().withMessage('Fecha inválida')
    .custom(value => {
      const hoy = new Date();
      const fecha = new Date(value);
      if (fecha >= hoy) throw new Error('La fecha debe ser anterior a hoy');
      return true;
    }),
  body('genero').isIn(['M', 'F', 'O']).withMessage('Género inválido'),
  body('ciudad').notEmpty().withMessage('Seleccione una ciudad')
];

// ---------------------- LISTAR ----------------------
router.get('/', async (req, res) => {
  try {
    const personas = await Persona.findAll({ order: [['createdAt', 'DESC']] });
    res.render('index', { personas, error: null });
  } catch (error) {
    console.error(error);
    res.render('index', { personas: [], error: 'Error al cargar los registros.' });
  }
});

// FORM CREAR 
router.get('/personas/new', (req, res) => {
  res.render('form', { persona: {}, errors: {}, ciudades, error: null });
});

//  CREAR 
router.post('/personas', personaValidations, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('form', { persona: req.body, errors: errors.mapped(), ciudades, error: null });
  }

  try {
    await Persona.create(req.body);
    res.redirect('/');
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      // DNI duplicado
      return res.render('form', { 
        persona: req.body, 
        errors: {}, 
        ciudades, 
        error: 'El número de cédula ya está registrado. Intenta con otro.' 
      });
    }
    console.error(error);
    res.render('form', { persona: req.body, errors: {}, ciudades, error: 'Error al guardar los datos.' });
  }
});

//  EDITAR 
router.get('/personas/:id/edit', async (req, res) => {
  try {
    const persona = await Persona.findByPk(req.params.id);
    if (!persona) return res.redirect('/');
    res.render('form', { persona, errors: {}, ciudades, error: null });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

//  ACTUALIZAR 
router.put('/personas/:id', personaValidations, async (req, res) => {
  const errors = validationResult(req);
  const persona = await Persona.findByPk(req.params.id);

  if (!persona) {
    return res.render('form', { persona: req.body, errors: {}, ciudades, error: 'Registro no encontrado.' });
  }

  if (!errors.isEmpty()) {
    return res.render('form', { persona: { ...req.body, id: req.params.id }, errors: errors.mapped(), ciudades, error: null });
  }

  try {
    await persona.update(req.body);
    res.redirect('/');
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.render('form', { 
        persona: { ...req.body, id: req.params.id }, 
        errors: {}, 
        ciudades, 
        error: 'El número de cédula ya está registrado por otro usuario.' 
      });
    }
    console.error(error);
    res.render('form', { persona: { ...req.body, id: req.params.id }, errors: {}, ciudades, error: 'Error al actualizar los datos.' });
  }
});

// BORRAR 
router.delete('/personas/:id', async (req, res) => {
  try {
    const persona = await Persona.findByPk(req.params.id);
    if (persona) await persona.destroy();
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

module.exports = router;
