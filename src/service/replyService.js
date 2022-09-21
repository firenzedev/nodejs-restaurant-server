const { Op } = require('sequelize');
const { AuthenticationError } = require('apollo-server-core');

module.exports = ({ replyModel, user }) => ({
  findRepliesByReviews: async (reviewIds) => {
    return replyModel.findAll({
      where: {
        reviewId: {
          [Op.in]: reviewIds,
        },
      },
    });
  },

  findRepliesByReview: async (reviewId) => {
    return replyModel.findAll({
      where: {
        reviewId,
      },
    });
  },

  createReply: async (reviewId, message) => {
    if (user === null) {
      throw new AuthenticationError('To create a reply user must be authenticated');
    }

    return replyModel.create({
      reviewId,
      message,
    });
  },
});
