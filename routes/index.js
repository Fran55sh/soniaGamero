require("dotenv").config();
let express = require("express");
let router = express.Router();
const fs = require("fs");
const Propiedades = require("../controllers/propiedadesControllers");
const Usuario = require('../controllers/userControllers')
const { propiedadesModel } = require("../db/config"); // Ajusta la ruta del archivo models.js según tu estructura de directorios

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

router.get("/api/propiedades", Propiedades.getPropiedades);

router.post("/acceso-restringido", Usuario.userAuth);

router.post("/crear-propiedad",  Propiedades.postPropiedad
)
module.exports = router;
