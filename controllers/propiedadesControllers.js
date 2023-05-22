const { propiedadesModel, tipoModel, condicionModel } = require('../db/config');
const { getTipoId, getCondicionId } = require("../helpers/getTiposConditions");
const path = require('path');
  const fs = require('fs');


class Propiedades {

  static async getPropiedades(req, res) {

    try {
      // Obtiene todas las propiedades con sus relaciones
      const propiedades = await propiedadesModel.findAll({
        include: [{ model: tipoModel }, { model: condicionModel }],
      });

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



  
  
  // ...
  
  static async postFotos (req, res) {
    try {
      console.log(`entra aca y el body es ${req.body}`)
      const propiedadesId = req.body.propiedadId;
      const fotos = req.files.fotos;
  
      for (let i = 0; i < fotos.length; i++) {
        const foto = fotos[i];
        const nombreFoto = Date.now() + '_' + i + path.extname(foto.name);
        const rutaFoto = path.join(__dirname, 'public/images/propiedades', nombreFoto);
  
        // Crea una función de promesa para guardar la foto en el sistema de archivos
        const guardarFoto = (rutaFoto) => {
          return new Promise((resolve, reject) => {
            foto.mv(rutaFoto, (error) => {
              if (error) {
                reject(error);
              } else {
                resolve();
              }
            });
          });
        };
  
        // Guarda la foto en el sistema de archivos
        await guardarFoto(rutaFoto);
  
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