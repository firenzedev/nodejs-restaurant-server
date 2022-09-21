module.exports = {
  Query: {
    restaurants: (_parent, { city }, { services }) => services.restaurantService.findAllRestaurants(city),

    restaurant: (_parent, { id }, { services }) => services.restaurantService.findRestaurant(id),

    reviews: (_parent, { restaurantId }, { services }) => services.reviewService.findReviewsByRestaurant(restaurantId),
  },
};
