module.exports = {
  Mutation: {
    createReview: async (_parent, { input }, { dataSources, pubSub }) => {
      const review = await dataSources.db.createReview(input.restaurantId, input.message, input.rating);
      pubSub.publish('REVIEW_ADDED', { reviewAdded: review });
      return review;
    },

    addReply: (_parent, { reviewId, message }, { dataSources }) => dataSources.db.createReply(reviewId, message),

    login: (_parent, { username, password }, { dataSources }) => dataSources.db.login(username, password),
  },
};
