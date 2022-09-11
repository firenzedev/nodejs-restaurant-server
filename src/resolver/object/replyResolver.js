module.exports = {
  Reply: {
    review: (parent, _args, { dataSources }) => dataSources.db.findReview(parent.reviewId),
  },
};
