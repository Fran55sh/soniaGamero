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

module.exports = router;
