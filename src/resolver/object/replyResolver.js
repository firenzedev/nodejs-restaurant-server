module.exports = {
  Reply: {
    review: (parent, _args, { loaders }) => loaders.reviews.load(parent.reviewId),
  },
};
