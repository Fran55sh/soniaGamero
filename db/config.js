// Importa las dependencias necesarias
const { Sequelize, DataTypes } = require('sequelize');

// Configura la conexión a la base de datos
const sequelize = new Sequelize('inmobiliaria', 'root', '', {
  host: 'localhost',
  dialect: 'mariadb',
});

// Define el modelo de Propiedad
const Propiedad = sequelize.define('Propiedad', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  esDestacado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  foto: {
    type: DataTypes.STRING, // O puedes utilizar DataTypes.TEXT si deseas almacenar la URL completa
    allowNull: true,
  },
});

// Define el modelo de Tipo
const Tipo = sequelize.define('Tipo', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Define el modelo de Condicion
const Condicion = sequelize.define('Condicion', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Relaciones entre modelos
Propiedad.belongsTo(Tipo);
Propiedad.belongsTo(Condicion);

// Sincroniza los modelos con la base de datos
sequelize.sync()
  .then(() => {
    console.log('Modelos sincronizados con la base de datos');
  })
  .catch((error) => {
    console.error('Error al sincronizar modelos:', error);
  });

// Exporta los modelos
module.exports = {
  Propiedad,
  Tipo,
  Condicion,
  sequelize,
};
