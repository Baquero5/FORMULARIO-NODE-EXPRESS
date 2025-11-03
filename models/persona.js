const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Persona = sequelize.define('Persona', {
    dni: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: 'El DNI es obligatorio' },
        isNumeric: { msg: 'El DNI debe contener solo números' },
        len: {
          args: [7, 10],
          msg: 'El DNI debe tener entre 7 y 10 dígitos'
        }
      }
    },

    nombres: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Los nombres son obligatorios' },
        len: { args: [2, 100], msg: 'Los nombres deben tener al menos 2 caracteres' },
        is: {
          args: [/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/],
          msg: 'Los nombres solo pueden contener letras y espacios'
        }
      }
    },

    apellidos: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Los apellidos son obligatorios' },
        len: { args: [2, 100], msg: 'Los apellidos deben tener al menos 2 caracteres' },
        is: {
          args: [/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/],
          msg: 'Los apellidos solo pueden contener letras y espacios'
        }
      }
    },

    fechaNacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'La fecha de nacimiento es obligatoria' },
        isDate: { msg: 'Fecha inválida' },
        isBeforeToday(value) {
          if (!value) return;
          const today = new Date();
          const date = new Date(value);
          if (date >= new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
            throw new Error('La fecha de nacimiento debe ser anterior a hoy');
          }
        }
      }
    },

    genero: {
      type: DataTypes.ENUM('M', 'F', 'O'),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El género es obligatorio' },
        isIn: {
          args: [['M', 'F', 'O']],
          msg: 'Género inválido'
        }
      }
    },

    ciudad: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'La ciudad es obligatoria' }
      }
    }
  }, {
    tableName: 'personas',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['dni']
      }
    ]
  });
  return Persona;
}