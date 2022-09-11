module.exports = {
  Restaurant: {
    numberOfReviews: (parent, _args, { dataSources }) => dataSources.db.countReviewsByRestaurant(parent.id),

    rating: async (parent, _args, { dataSources }) => {
      const reviews = await dataSources.db.findReviewsByRestaurant(parent.id);
      if (reviews.length === 0) {
        return 0;
      }

      const ratings = reviews.map((review) => review.rating);
      return (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2);
    },

    reviews: (parent, { rating }, { dataSources }) => dataSources.db.findReviewsByRestaurant(parent.id, rating),
  },
};
