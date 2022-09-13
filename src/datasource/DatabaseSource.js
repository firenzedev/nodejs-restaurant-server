const { DataSource } = require('apollo-datasource');
const { AuthenticationError } = require('apollo-server-core');
const { Op } = require('sequelize');

const TOKEN = 'fakeTokenJustForEducationalPurposes';

class DatabaseSource extends DataSource {
  constructor({ models, user }) {
    super();
    this.models = models;
    this.user = user;
  }

  async findAllRestaurants(city) {
    const options = {};

    if (city) {
      const sequelize = this.models.sequelize;
      options.where = sequelize.where(sequelize.fn('LOWER', sequelize.col('city')), city.toLowerCase());
    }

    return this.models.restaurant.findAll(options);
  }

  async findRestaurant(id) {
    return this.models.restaurant.findByPk(id);
  }

  async findRestaurants(ids) {
    return this.models.restaurant.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });
  }

  async findReviewsByRestaurants(restaurantIds, rating = 0) {
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

    return this.models.review.findAll(options);
  }

  async countReviewsByRestaurants(restaurantIds) {
    return this.models.review.count({
      where: {
        restaurantId: {
          [Op.in]: restaurantIds,
        },
      },
      group: ['restaurantId'],
      attributes: ['restaurantId'],
    });
  }

  async averageRatingForRestaurants(restaurantIds) {
    const sequelize = this.models.sequelize;
    return this.models.review.findAll({
      where: {
        restaurantId: {
          [Op.in]: restaurantIds,
        },
      },
      group: ['restaurantId'],
      attributes: ['restaurantId', [sequelize.fn('AVG', sequelize.col('rating')), 'rating']],
    });
  }

  async findReviewsByRestaurant(restaurantId, rating = 0) {
    const options = { where: { restaurantId } };

    if (rating > 0) {
      options.where.rating = { [Op.gte]: rating };
    }

    return this.models.review.findAll(options);
  }

  async countReviewsByRestaurant(restaurantId) {
    return this.models.review.count({
      where: {
        restaurantId,
      },
    });
  }

  async findRepliesByReviews(reviewIds) {
    return this.models.reply.findAll({
      where: {
        reviewId: {
          [Op.in]: reviewIds,
        },
      },
    });
  }

  async findRepliesByReview(reviewId) {
    return this.models.reply.findAll({
      where: {
        reviewId,
      },
    });
  }

  async findReview(id) {
    return this.models.review.findByPk(id);
  }

  async findReviews(ids) {
    return this.models.review.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });
  }

  async createReview(restaurantId, message, rating) {
    if (this.user === null) {
      throw new AuthenticationError('To create a review user must be authenticated');
    }

    return this.models.review.create({
      restaurantId,
      message,
      rating,
    });
  }

  async createReply(reviewId, message) {
    if (this.user === null) {
      throw new AuthenticationError('To create a reply user must be authenticated');
    }

    return this.models.reply.create({
      reviewId,
      message,
    });
  }

  login(username, password) {
    if (username !== 'guest' || password !== 'secret') {
      throw new AuthenticationError('Wrong credentials');
    }

    return TOKEN;
  }

  validateToken(token) {
    if (token === TOKEN) {
      return {
        id: 123,
        username: 'guest',
        role: 'GUEST',
      };
    }

    return null;
  }
}

module.exports = DatabaseSource;
