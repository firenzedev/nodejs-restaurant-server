module.exports =
  ({ reviewService }) =>
  async (restaurantIds) => {
    const dataset = await reviewService.countReviewsByRestaurants(restaurantIds);
    return restaurantIds.map((id) => dataset.find((row) => row.restaurantId == id)?.count || 0);
  };
