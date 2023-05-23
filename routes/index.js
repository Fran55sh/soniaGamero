require("dotenv").config();
let express = require("express");
let router = express.Router();
const Propiedades = require("../controllers/propiedadesControllers");
const Usuario = require('../controllers/userControllers')
const { propiedadesModel } = require("../db/config"); 
const upload = require("../controllers/propiedadesControllers")


/* GET home page. */

router.get("/", function (req, res, next) {
  res.render("index", { title: "Sonia Gamero Propiedades" });
});

router.get("/propiedades", function (req, res, next) {
  res.render("propiedades");
});

router.get("/admin", function (req, res, next) {
  res.render("admin", { title: "Sonia Gamero Propiedades" });
});

router.get('/api/propiedades', Propiedades.getPropiedades);

router.post("/acceso-restringido", Usuario.userAuth);

router.post("/crear-propiedad",  Propiedades.postPropiedad)

router.post("/subir-fotos", Propiedades.postFotos);

module.exports = router;
