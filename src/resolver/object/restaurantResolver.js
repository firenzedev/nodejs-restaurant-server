const MathUtils = require('../../util/MathUtils');

module.exports = {
  Restaurant: {
    numberOfReviews: (parent, _args, { dataSources }) => dataSources.db.countReviewsByRestaurant(parent.id),

    rating: async (parent, _args, { dataSources }) => {
      const reviews = await dataSources.db.findReviewsByRestaurant(parent.id);
      const ratings = reviews.map((review) => review.rating);
      return MathUtils.average(ratings);
    },

    reviews: async (parent, { rating }, { dataSources }) => dataSources.db.findReviewsByRestaurant(parent.id, rating),
  },
};
