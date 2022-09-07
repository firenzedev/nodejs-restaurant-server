module.exports = {
  Restaurant: {
    numberOfReviews: (parent, _args, { loaders }) => loaders.restaurantReviewsNumber.load(parent.id),

    rating: (parent, _args, { loaders }) =>
      loaders.restaurantAverageRating.load(parent.id).then((rating) => rating.toFixed(1)),

    reviews: (parent, { rating }, { loaders }) => loaders.restaurantReviewsWithRating.load({ key: parent.id, rating }),
  },
};
