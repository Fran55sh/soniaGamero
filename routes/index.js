require("dotenv").config();
let express = require("express");
let router = express.Router();
const fs = require("fs");
const Propiedades = require("../controllers/properties");
const { propiedadesModel } = require("../db/config"); // Ajusta la ruta del archivo models.js según tu estructura de directorios
const { getTipoId, getCondicionId } = require("../helpers/getTiposConditions");
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

router.post("/acceso-restringido", (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (password === adminPassword) {
    // Contraseña correcta, permite el acceso
    res.render("restricted");
  } else {
    // Contraseña incorrecta, muestra un mensaje de error
    res.send("Contraseña incorrecta");
  }
});

// router.post("/crear-propiedad", async (req, res) => {
//   try {

//     // Obtener los archivos de imagen seleccionados
//     const fotos = req.files; // Asegúrate de haber configurado el middleware adecuado para manejar las imágenes enviadas en la solicitud (por ejemplo, usando multer)

//     // Array para almacenar los nombres de las fotos
//     const nombresFotos = [];

//     // Iterar sobre los archivos de imagen y guardarlos en la carpeta "imagenes"
//     fotos.forEach((foto) => {
//       const nombreFoto = foto.name;
//       const pathFoto = `imagenes/${nombreFoto}`;

//       // Guardar la foto en la carpeta "imagenes"
//       fs.writeFile(pathFoto, foto.data, (error) => {
//         if (error) {
//           console.error(`Error al guardar la foto ${nombreFoto}:`, error);
//         } else {
//           console.log(`Foto ${nombreFoto} guardada exitosamente.`);
//           nombresFotos.push(nombreFoto);
//         }
//       });
//     });

//     const { nombre, descripcion, precio, destacado, foto, tipo, condicion } =
//       req.body;

//     const tipoId = getTipoId(tipo);
//     const condicionId = getCondicionId(condicion);
//     const esDestacado = 0;
//     if (destacado === true) {
//       esDestacado = 1;
//     }

//     // console.log(nombre, descripcion,precio, esDestacado, foto, tipo, condicion )

//     if (tipoId === null || condicionId === null) {
//       // Manejo de error si tipo o condicion no son válidos
//       return res.status(400).json({ error: "Tipo o condicion inválido" });
//     }

//     console.log("por aqui", tipoId, condicionId);
//     // Crea la propiedad en la base de datos

//     const propiedad = await propiedadesModel.create({
//       nombre,
//       descripcion,
//       precio,
//       esDestacado,
//       foto,
//       tipoId,
//       condicionId,
//     });

//     // Devuelve la propiedad creada como respuesta
//     res.status(201).json(propiedad);
//   } catch (error) {
//     // Manejo de errores
//     console.error("Error al crear la propiedad:", error);
//     res.status(500).json({ error: "Error al crear la propiedad" });
//   }
// });

router.post("/crear-propiedad", Propiedades.postPropiedad)
module.exports = router;
