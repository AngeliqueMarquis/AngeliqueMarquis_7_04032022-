'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.User, {
        foreignKey : 'userId',
        onDelete: 'cascade',
      });
      Post.hasMany(models.Comment, {
        foreignKey : 'userId',
        onDelete: 'cascade',
      });
      models.Post.hasMany(models.Like);
    }
  }
  Post.init({
    userId: DataTypes.STRING,
    content: DataTypes.STRING,
    link: DataTypes.STRING,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};