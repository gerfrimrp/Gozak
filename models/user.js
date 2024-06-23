'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.UserProfile, { foreignKey: 'UserId' })
      User.hasMany(models.Order, { foreignKey: 'CustomerId' })
    }


  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
        notEmpty: {
          args: true,
          msg: `Email tidak boleh kosong`
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: `Password tidak boleh kosong`
        }
      }
    }
    ,
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: `Role tidak boleh kosong`
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate(instace, option) {

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(instace.password, salt);

        instace.password = hash;
      }
    }
  });
  return User;
};