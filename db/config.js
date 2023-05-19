// Importa las dependencias necesarias
const { Sequelize, DataTypes } = require('sequelize');

// Configura la conexión a la base de datos
const sequelize = new Sequelize('inmobiliaria', 'root', '', {
  host: 'localhost',
  dialect: 'mariadb',
});

const propiedadesModel = sequelize.define(
  'Propiedad',
  {
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
  },
  {
    timestamps: false, // Deshabilita las columnas createdAt y updatedAt
  }
);




// Define el modelo de Tipo
const tipoModel = sequelize.define('tipo', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Define el modelo de Condicion
const condicionModel = sequelize.define('condicion', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const fotoModel = sequelize.define('foto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  datos: {
    type: DataTypes.JSON,
    allowNull: false
  }
});

// Relaciones entre modelos
propiedadesModel.belongsTo(tipoModel);
propiedadesModel.belongsTo(condicionModel);
propiedadesModel.hasMany(fotoModel, { foreignKey: 'propiedad_id' });

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
  propiedadesModel,
  tipoModel,
  condicionModel,
  fotoModel,
  sequelize,
};

