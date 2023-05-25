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
      
      const propiedadesConFotos = propiedades.map(propiedad => {
        const fotos = propiedad.fotos?.map(foto => foto.nombre) || [];
        return {
          ...propiedad.toJSON(),
          fotos: fotos
        };
      });;
      
      // Devuelve las propiedades con relaciones en la respuesta
      res.json(propiedades);
    } catch (error) {
      console.error('Error al obtener las propiedades:', error);
      res.status(500).json({ error: 'Error al obtener las propiedades' });
    }
  }

  static async getPropiedadesById(req, res) {
    const id = req.params.id
    console.log(id)
    try {
      // Obtiene todas las propiedades con sus relaciones
      const propiedad = await propiedadesModel.findAll({
        include: [
          { model: tipoModel },
          { model: condicionModel },
          { model: fotoModel }
        ],
        where: {
          '$propiedades.id$': id
        }
      });
      
      
      // Devuelve la propiedad con relaciones en la respuesta
      if (propiedad.length === 0) {
        // Maneja el caso cuando no hay propiedad encontradas
        res.render('detallePropiedad', { propiedad: null }); // o puedes pasar un mensaje de error
      } else {
        // Devuelve la propiedad con relaciones en la respuesta
        console.log(propiedad);
        res.render('detallePropiedad', { propiedad });
        // res.json(propiedad)
        

      }


    } catch (error) {
      console.error('Error al obtener la propiedad:', error);
      res.status(500).json({ error: 'Error al obtener la propiedad' });
    }
  }


  static async getPropiedadesByTipo(req, res) {
    const tipo = req.params.dato
    console.log(tipo)
    try {
      // Obtiene todas las propiedades con sus relaciones
      const propiedades = await propiedadesModel.findAll({
        include: [
          { model: tipoModel },
          { model: condicionModel },
          { model: fotoModel }
        ],
        where: {
          '$tipo.nombre$': tipo
        }
      });
      
      
      // Devuelve las propiedades con relaciones en la respuesta
      if (propiedades.length === 0) {
        // Maneja el caso cuando no hay propiedades encontradas
        res.render('propiedades', { propiedades: null }); // o puedes pasar un mensaje de error
      } else {
        // Devuelve las propiedades con relaciones en la respuesta
        console.log(propiedades);
        res.render('propiedades', { propiedades });
        // res.json(propiedades)
      }


    } catch (error) {
      console.error('Error al obtener las propiedades:', error);
      res.status(500).json({ error: 'Error al obtener las propiedades' });
    }
  }

  static async getPropiedadesBydate(req, res) {
    try {
      // Obtiene las últimas 4 propiedades creadas con sus relaciones
      const ultimasPropiedades = await propiedadesModel.findAll({
        include: [
          { model: tipoModel },
          { model: condicionModel },
          { model: fotoModel }
        ],

        order: [['createdAt', 'DESC']],
        limit: 4
      });

      const value = 1
        const featPropiedades = await propiedadesModel.findAll({
          include: [
            { model: tipoModel },
            { model: condicionModel },
            { model: fotoModel }
          ],
          where: {
            '$propiedades.esDestacado$': value
          }
        });
      
      if (ultimasPropiedades.length && featPropiedades === 0) {
        // Maneja el caso cuando no hay propiedades encontradas
        res.render('propiedades', { ultimasPropiedades: null, featPropiedades:null }); // o puedes pasar un mensaje de error
      } else {
        // Devuelve las propiedades con relaciones en la respuesta
        console.log(ultimasPropiedades, featPropiedades);
        res.render('index', { ultimasPropiedades, featPropiedades });
        // res.json(ultimasPropiedades);
      }
    } catch (error) {
      console.error('Error al obtener las propiedades:', error);
      res.status(500).json({ error: 'Error al obtener las propiedades' });
    }
  }
  
  // static async getPropiedadesIfFeatured(req, res) {
  //   let value = 1
    
  //   try {
  //     // Obtiene todas las propiedades con sus relaciones
  //     const featPropiedades = await propiedadesModel.findAll({
  //       include: [
  //         { model: tipoModel },
  //         { model: condicionModel },
  //         { model: fotoModel }
  //       ],
  //       where: {
  //         '$propiedes.esDestacado$': value
  //       }
  //     });
      
      
  //     // Devuelve las propiedades con relaciones en la respuesta
  //     if (featPropiedades.length === 0) {
  //       // Maneja el caso cuando no hay propiedades encontradas
  //       res.render('index', { featPropiedades: null }); // o puedes pasar un mensaje de error
  //     } else {
  //       // Devuelve las propiedades con relaciones en la respuesta
  //       console.log(featPropiedades);
  //       res.render('index', { featPropiedades });
  //       // res.json(propiedades)
  //     }


  //   } catch (error) {
  //     console.error('Error al obtener las propiedades:', error);
  //     res.status(500).json({ error: 'Error al obtener las propiedades' });
  //   }
  // }

  static async postPropiedad(req, res) {
    try {
      const { nombre, descripcion, descripcioncorta, direccion, precio, esDestacado, mapa, tipo, condicion } = req.body;
      
      const tipoId = getTipoId(tipo);
      const condicionId = getCondicionId(condicion);
      let esDestacadoValue = 0;

      if (esDestacado === true) {
        esDestacadoValue = 1;
      }


      if (tipoId === null || condicionId === null) {
        // Manejo de error si tipo o condicion no son válidos
        return res.status(400).json({ error: "Tipo o condicion inválido" });
      }


      // Crea la propiedad en la base de datos
      const propiedad = await propiedadesModel.create({
        nombre,
        descripcion,
        descripcioncorta,
        direccion,
        precio,
        esDestacado,
        mapa,
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
  console.log('entra aca')
  try {
    const propiedadesId = req.body.propiedadId;
    const fotos = req.files;

    for (let i = 0; i < fotos.length; i++) {
      const foto = fotos[i];
      const nombreFoto = foto.filename;
      const rutaFoto = foto.path;

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