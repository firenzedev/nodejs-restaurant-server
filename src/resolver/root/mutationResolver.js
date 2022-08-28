module.exports = {
  Mutation: {
    createReview: (_parent, { input }, { dataSources }) =>
      dataSources.db.createReview(input.restaurantId, input.message, input.rating),

    addReply: (_parent, { reviewId, message }, { dataSources }) => dataSources.db.createReply(reviewId, message),
  },
};
