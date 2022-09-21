const authService = require('./authService');
const replyService = require('./replyService');
const restaurantService = require('./restaurantService');
const reviewService = require('./reviewService');

module.exports = (models) => {
  const context = {
    sequelize: models.sequelize,
  };
  const auth = authService({ authModel: models.auth, ...context });

  return {
    validateAuth: auth.validateToken,
    createServices: (user) => ({
      restaurantService: restaurantService({ restaurantModel: models.restaurant, user, ...context }),
      reviewService: reviewService({ reviewModel: models.review, user, ...context }),
      replyService: replyService({ replyModel: models.reply, user, ...context }),
      authService: auth,
    }),
  };
};
