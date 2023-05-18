var express = require('express');
var router = express.Router();
require('dotenv').config()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Sonia Gamero Propiedades' });
});

router.get('/propiedades', function (req, res, next) {
  res.render('propiedades')
})

router.get('/admin', function (req, res, next) {
  res.render('admin', { title: 'Sonia Gamero Propiedades' });
});

router.post('/acceso-restringido', (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (password === adminPassword) {
    // Contraseña correcta, permite el acceso
    res.render('restricted');
  } else {
    // Contraseña incorrecta, muestra un mensaje de error
    res.send('Contraseña incorrecta');
  }
});


const express = require('express');
const { Propiedad, Tipo, Condicion, sequelize } = require('./ruta-de-tu-modelo');

const app = express();
app.use(express.json());

// Ruta para crear una nueva propiedad
app.post('/crear-propiedad', async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      precio,
      esDestacado,
      foto,
      tipo,
      condicion,
    } = req.body;

    // // Busca el tipo y la condición en la base de datos
    // const tipoEncontrado = await Tipo.findOne({ where: { nombre: tipo } });
    // const condicionEncontrada = await Condicion.findOne({
    //   where: { nombre: condicion },
    // });

    // // Si no se encuentra el tipo o la condición, envía una respuesta de error
    // if (!tipoEncontrado || !condicionEncontrada) {
    //   return res.status(404).json({ error: 'Tipo o condición no encontrados' });
    // }

    // Crea una nueva propiedad en la base de datos
    const nuevaPropiedad = await Propiedad.create({
      nombre,
      descripcion,
      precio,
      esDestacado,
      foto,
      TipoId: tipoEncontrado.id,
      CondicionId: condicionEncontrada.id,
    });

    res.status(201).json({ mensaje: 'Propiedad creada exitosamente', propiedad: nuevaPropiedad });
  } catch (error) {
    console.error('Error al crear la propiedad:', error);
    res.status(500).json({ error: 'Error al crear la propiedad' });
  }
});




module.exports = router;
