module.exports = {
  Mutation: {
    createReview: async (_parent, { input }, { services, pubSub }) => {
      const review = await services.reviewService.createReview(input.restaurantId, input.message, input.rating);
      pubSub.publish('REVIEW_ADDED', { reviewAdded: review });
      return review;
    },

    addReply: (_parent, { reviewId, message }, { services }) => services.replyService.createReply(reviewId, message),

    login: (_parent, { username, password }, { services }) => services.authService.login(username, password),
  },
};
