const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Persona', {
    dni: { type: DataTypes.STRING, allowNull: false, unique: true },
    nombres: { type: DataTypes.STRING, allowNull: false },
    apellidos: { type: DataTypes.STRING, allowNull: false },
    fechaNacimiento: { type: DataTypes.DATEONLY, allowNull: false },
    genero: { type: DataTypes.STRING, allowNull: false }, // 'M','F','O'
    ciudad: { type: DataTypes.STRING, allowNull: false }
  },{
    tableName: 'personas'
  });
};
