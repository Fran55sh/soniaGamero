const multer = require('multer');
const path = require('path');
const fs = require('fs')
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


static async deletePropiedad(req, res) {
  
  try {
    const propiedadId = req.body.propiedadId;

    // Obtén la lista de nombres de imágenes asociadas a la propiedad desde la base de datos
    const fotos = await fotoModel.findAll({
      where: {
        propiedadId: propiedadId
      },
      attributes: ['nombre']
    });

    // Elimina las imágenes del sistema de archivos
    for (let i = 0; i < fotos.length; i++) {
      const foto = fotos[i];
      const rutaFoto = path.join(__dirname, "../public/images/propiedades", foto.nombre);
     
      
      try {
        // Verifica si la imagen existe en el sistema de archivos antes de eliminarla
        if (fs.existsSync(rutaFoto)) {
          // Elimina la imagen del sistema de archivos
          fs.unlinkSync(rutaFoto);
        }
      } catch (err) {
        console.error("Error al eliminar la imagen del sistema de archivos:", err);
      }
    }

    // Elimina los registros de imágenes asociados a la propiedad de la base de datos
    await fotoModel.destroy({
      where: {
        propiedadId: propiedadId
      }
    });

    // Elimina la propiedad de la base de datos
    await propiedadesModel.destroy({
      where: {
        id: propiedadId
      }
    });

    res.status(200).json({ message: 'Propiedad y sus imágenes eliminadas correctamente' });
  } catch (error) {
    console.error('Error al eliminar la propiedad y sus imágenes:', error);
    res.status(500).json({ error: 'Error al eliminar la propiedad y sus imágenes' });
  }
}



};





module.exports = Propiedades, upload;