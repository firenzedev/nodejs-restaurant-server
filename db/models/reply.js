'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class reply extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      reply.belongsTo(models.review);
    }
  }
  reply.init(
    {
      message: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'reply',
    }
  );
  return reply;
};
