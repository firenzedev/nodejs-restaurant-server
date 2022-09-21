const { Op } = require('sequelize');
const { AuthenticationError } = require('apollo-server-core');

module.exports = ({ reviewModel, sequelize, user }) => ({
  findReviewsByRestaurants: async (restaurantIds, rating = 0) => {
    const options = {
      where: {
        restaurantId: {
          [Op.in]: restaurantIds,
        },
      },
    };

    if (rating > 0) {
      options.where.rating = { [Op.gte]: rating };
    }

    return reviewModel.findAll(options);
  },

  countReviewsByRestaurants: async (restaurantIds) => {
    return reviewModel.count({
      where: {
        restaurantId: {
          [Op.in]: restaurantIds,
        },
      },
      group: ['restaurantId'],
      attributes: ['restaurantId'],
    });
  },

  averageRatingForRestaurants: async (restaurantIds) => {
    return reviewModel.findAll({
      where: {
        restaurantId: {
          [Op.in]: restaurantIds,
        },
      },
      group: ['restaurantId'],
      attributes: ['restaurantId', [sequelize.fn('AVG', sequelize.col('rating')), 'rating']],
    });
  },

  findReviewsByRestaurant: async (restaurantId, rating = 0) => {
    const options = { where: { restaurantId } };

    if (rating > 0) {
      options.where.rating = { [Op.gte]: rating };
    }

    return reviewModel.findAll(options);
  },

  countReviewsByRestaurant: async (restaurantId) => {
    return reviewModel.count({
      where: {
        restaurantId,
      },
    });
  },

  findReview: async (id) => {
    return reviewModel.findByPk(id);
  },

  findReviews: async (ids) => {
    return reviewModel.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });
  },

  createReview: async (restaurantId, message, rating) => {
    if (user === null) {
      throw new AuthenticationError('To create a review user must be authenticated');
    }

    return reviewModel.create({
      restaurantId,
      message,
      rating,
    });
  },
});
