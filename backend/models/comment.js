module.exports = (sequelize, Sequelize) => {
  const Comment = sequelize.define('Comment', {
    textComment: {
      type: Sequelize.TEXT,
      allowNull: false
    }
  },
    {
      tableName: 'comment'
    }
  );
  Comment.associate = models => {
    Comment.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'cascade'
      });
    Comment.belongsTo(models.Post, {
      foreignKey: 'postId',
      onDelete: 'cascade'
    });
  };
  return Comment;
};