module.exports = {
  Query: {
    restaurants: (_parent, { city }, { dataSources }) => dataSources.db.findAllRestaurants(city),
    restaurant: (_parent, { id }, { dataSources }) => dataSources.db.findRestaurant(id),
    reviews: (_parent, { restaurantId }, { dataSources }) => dataSources.db.findReviewsByRestaurant(restaurantId),
  },
};
