const { propiedadesModel, tipoModel, condicionModel } = require('../db/config');
const { getTipoId, getCondicionId } = require("../helpers/getTiposConditions");

class Propiedades {

  static async getPropiedades(req, res) {

    try {
      // Obtiene todas las propiedades con sus relaciones
      const propiedades = await Propiedad.findAll({
        include: [{ model: Tipo }, { model: Condicion }],
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'Tipo.createdAt', 'Tipo.updatedAt']
        }
      });

      // Devuelve las propiedades con relaciones en la respuesta
      res.json(propiedades);
    } catch (error) {
      console.error('Error al obtener las propiedades:', error);
      res.status(500).json({ error: 'Error al obtener las propiedades' });
    }
  }

  static async postPropiedad(req, res) {
    console.log('entro aca')
    try {
      console.log(req.body)
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

  static async postFotos(req, res) {
  try {
    const propiedadesId = req.body.propiedadId; // Obtén el ID de la propiedad desde la solicitud (ajusta esto según tu implementación)
    const fotos = req.files.fotos; // Obtén las fotos del cuerpo de la solicitud (asegúrate de que el campo en el formulario se llame "fotos")

    for (let i = 0; i < fotos.length; i++) {
      const foto = fotos[i];

      // Genera un nombre único para la foto
      const nombreFoto = Date.now() + '_' + i + path.extname(foto.name);

      // Crea la ruta completa donde se guardará la foto
      const rutaFoto = path.join(__dirname, 'public/images/propiedades', nombreFoto);

      // Guarda la foto en el sistema de archivos
      await foto.mv(rutaFoto);

      // Crea una nueva instancia de Foto con el nombre de la foto y el ID de la propiedad
      await fotosModel.create({
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

};





module.exports = Propiedades;