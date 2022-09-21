const { Op } = require('sequelize');

module.exports = ({ restaurantModel, sequelize }) => ({
  findAllRestaurants: async (city) => {
    const options = {};

    if (city) {
      options.where = sequelize.where(sequelize.fn('LOWER', sequelize.col('city')), city.toLowerCase());
    }

    return restaurantModel.findAll(options);
  },

  findRestaurant: async (id) => {
    return restaurantModel.findByPk(id);
  },

  findRestaurants: async (ids) => {
    return restaurantModel.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });
  },
});
