const { reduceToSingleUniqueValue } = require('../util/ArrayUtils');

module.exports = (db) => async (elements) => {
  const rating = reduceToSingleUniqueValue(elements.map((element) => element.rating));
  const restaurantIds = elements.map((arg) => arg.key);

  const dataset = await db.findReviewsByRestaurants(restaurantIds, rating);
  return elements.map((element) => dataset.filter((review) => review.restaurantId === element.key));
};
