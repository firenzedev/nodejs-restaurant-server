module.exports = (db) => async (restaurantIds) => {
  const dataset = await db.countReviewsByRestaurants(restaurantIds);
  return restaurantIds.map((id) => dataset.find((row) => row.restaurantId === id)?.count || 0);
};
