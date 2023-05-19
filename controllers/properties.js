const { propiedadesModel, tipoModel, condicionModel } = require('../db/config');

class Propiedades{

    static async getPropiedades(req, res) {
        
        try {
            // Obtiene todas las propiedades con sus relaciones
            const propiedades = await propiedadesModel.findAll({
              include: [
                { model: tipoModel },
                { model: condicionModel }
              ]
            });
        
            // Devuelve las propiedades con relaciones en la respuesta
            res.json(propiedades);
          } catch (error) {
            console.error('Error al obtener las propiedades:', error);
            res.status(500).json({ error: 'Error al obtener las propiedades' });
          }
      }

      static async postPropiedad(req, res) {
        if (req.files) {
          console.log(req.files);
          let file = req.files.files;
          let filename = file.name;
    
          file.mv("./views/assets/" + filename, function (err) {
            if (err) {
              res.send(err);
              return;
            } else {
              console.log("foto uploaded");
            }
          });
          
          
          // let thumbnailFile = req.files.thumbnail
          // let thumbnailName = thumbnailFile.name
    
          // thumbnailFile.mv("./images/" + thumbnailName, function (err) {
          //   if (err) {
          //     res.send(err);
          //     return;
          //   } else {
          //     console.log("photo uploaded");
          //   }
          // });
    
    
    
          const filePath = `./assets/${filename}`;
          console.log(filePath)
    
          /* Creating a new curso in the database. */
          const { nombre,
            descripcion,
            precio,
            foto,
            tipoId,
            condicionId } = req.body;
          try {
            const createPropiedad = await cursoModel.create({
              nombre,
              descripcion,
              precio,
              foto,
              tipoId,
              condicionId
            });
            res.render('admin')
          } catch (error) {
            return res.status(500).json({
              status: 500,
              error,
            });
          }
        } else {
          console.log("no se selecciono un arhivo");
        }
      }
    
}

    module.exports = Propiedades; 
    
    
    