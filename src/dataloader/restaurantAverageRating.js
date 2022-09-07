module.exports = (db) => async (restaurantIds) => {
  const dataset = await db.averageRatingForRestaurants(restaurantIds);
  return restaurantIds.map((id) => dataset.find((row) => row.restaurantId === id)?.rating || 0);
};
