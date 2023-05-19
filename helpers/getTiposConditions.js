// Ruta para crear una propiedad
const getTipoId = (tipo) => {
    console.log(tipo)
    switch (tipo) {
      case 'Casas':
        return 1;
      case 'Departamentos':
        return 2;
      case 'Fideicomisos':
        return 3;
      case 'Proyectos':
        return 4;
      case 'Locales':
        return 5;
      default:
        return null;
    }
  };
  
  const getCondicionId = (condicion) => {
    console.log(condicion)
    switch (condicion) {
      case 'Venta':
        return 1;
      case 'Alquiler':
        return 2;
      default:
        return null;
    }
  };

  module.exports = {
    getCondicionId, 
    getTipoId
  }