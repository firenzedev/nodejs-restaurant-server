module.exports =
  ({ reviewService }) =>
  async (restaurantIds) => {
    const dataset = await reviewService.averageRatingForRestaurants(restaurantIds);
    return restaurantIds.map((id) => dataset.find((row) => row.restaurantId == id)?.rating || 0);
  };
