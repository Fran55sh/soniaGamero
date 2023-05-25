// Importa las dependencias necesarias
const { Sequelize, DataTypes } = require('sequelize');

// Configura la conexión a la base de datos
const sequelize = new Sequelize('inmobiliaria', 'root', '', {
  host: 'localhost',
  dialect: 'mariadb',
});

const propiedadesModel = sequelize.define(
  'propiedades',
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    descripcioncorta: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    direccion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    precio: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    esDestacado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    mapa: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    // timestamps: false,
  }
);

const tipoModel = sequelize.define('tipos', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // timestamps: false,
});

const condicionModel = sequelize.define('condiciones', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // timestamps: false,
});

const fotoModel = sequelize.define('fotos', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // timestamps: false,
});

// Establece las relaciones entre los modelos
propiedadesModel.belongsTo(tipoModel, { foreignKey: 'tipoId' });
propiedadesModel.belongsTo(condicionModel, { foreignKey: 'condicionId' });
propiedadesModel.hasMany(fotoModel, { foreignKey: 'propiedadId' });

// Sincroniza los modelos con la base de datos
sequelize.sync()
  .then(() => {
    console.log('Modelos sincronizados correctamente');
  })
  .catch((error) => {
    console.error('Error al sincronizar los modelos:', error);
  });

// Exporta los modelos
module.exports = {
  propiedadesModel,
  tipoModel,
  condicionModel,
  fotoModel,
  sequelize,
};

