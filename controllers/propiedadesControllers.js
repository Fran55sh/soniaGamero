const multer = require('multer');
const path = require('path');
const { propiedadesModel, tipoModel, condicionModel, fotoModel } = require('../db/config');
const { getTipoId, getCondicionId } = require("../helpers/getTiposConditions");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public/images/propiedades'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '_' + file.originalname);
  }
});

const upload = multer({ storage: storage });
class Propiedades {

  static async getPropiedades(req, res) {

    try {
      // Obtiene todas las propiedades con sus relaciones
      const propiedades = await propiedadesModel.findAll({
        include: [
          { model: tipoModel },
          {model: condicionModel}, 
          { model: fotoModel,  }
        ],
      });
      
      console.log(propiedades)
      const propiedadesConFotos = propiedades.map(propiedad => {
        const fotos = propiedad.fotos?.map(foto => foto.nombre) || [];
        return {
          ...propiedad.toJSON(),
          fotos: fotos
        };
      });;
      
      console.log(propiedadesConFotos);
      // Devuelve las propiedades con relaciones en la respuesta
      res.json(propiedades);
    } catch (error) {
      console.error('Error al obtener las propiedades:', error);
      res.status(500).json({ error: 'Error al obtener las propiedades' });
    }
  }

  static async postPropiedad(req, res) {
    try {
      console.log(req.body)
      console.log('entro aca')
      const { nombre, descripcion, precio, esDestacado, tipo, condicion } = req.body;
      
      const tipoId = getTipoId(tipo);
      const condicionId = getCondicionId(condicion);
      let esDestacadoValue = 0;

      console.log(`tipo ${tipoId} - condicion ${condicionId}`)
      if (esDestacado === true) {
        esDestacadoValue = 1;
      }

      // console.log(nombre, descripcion,precio, esDestacado, foto, tipo, condicion )

      if (tipoId === null || condicionId === null) {
        // Manejo de error si tipo o condicion no son válidos
        return res.status(400).json({ error: "Tipo o condicion inválido" });
      }

      console.log("por aqui", tipoId, condicionId);

      // Crea la propiedad en la base de datos
      const propiedad = await propiedadesModel.create({
        nombre,
        descripcion,
        precio,
        esDestacado,
        tipoId,
        condicionId,
      });

      // Devuelve la propiedad creada como respuesta

      res.status(201).json(propiedad);
    } catch (error) {
      // Manejo de errores
      console.error('Error al crear la propiedad:', error);
      res.status(500).json({ error: 'Error al crear la propiedad' });
    }
  }


// Maneja la solicitud POST utilizando multer
static async postFotos (req, res) {
  try {
    const propiedadesId = req.body.propiedadId;
    const fotos = req.files;

    for (let i = 0; i < fotos.length; i++) {
      const foto = fotos[i];
      const nombreFoto = foto.filename;
      const rutaFoto = foto.path;
      console.log(nombreFoto)

      // Crea una nueva instancia de Foto con el nombre de la foto y el ID de la propiedad
      await fotoModel.create({
        nombre: nombreFoto,
        propiedadId: propiedadesId,
      });
    }

    res.status(200).json({ message: 'Fotos almacenadas exitosamente' });
  } catch (error) {
    console.error('Error al almacenar las fotos:', error);
    res.status(500).json({ error: 'Error al almacenar las fotos' });
  }
};

// Aplica el middleware de multer en la ruta para manejar los datos de FormData



};





module.exports = Propiedades, upload;