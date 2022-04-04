'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Post,{
        foreignKey : 'userId',
         onDelete: 'cascade'
     });
   User.hasMany(models.Comment,{
        foreignKey : 'postId',
         onDelete: 'cascade'
     });
    }
  }
  User.init({
    email:{
      type: DataTypes.STRING,
      validate: {
        isEmail: true
    },
    unique: {
       args: 'email',
       msg: 'The email is already taken!'
    }},
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    image: DataTypes.STRING,
    password: DataTypes.STRING,
    admin: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};