const { DataSource } = require('apollo-datasource');
const { Op } = require('sequelize');

class DatabaseSource extends DataSource {
  constructor({ models }) {
    super();
    this.models = models;
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

  async createReview(restaurantId, message, rating) {
    return this.models.review.create({
      restaurantId,
      message,
      rating,
    });
  }

  async createReply(reviewId, message) {
    return this.models.reply.create({
      reviewId,
      message,
    });
  }
}

module.exports = DatabaseSource;
