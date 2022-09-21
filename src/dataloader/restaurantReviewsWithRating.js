const { reduceToSingleUniqueValue } = require('../util/ArrayUtils');

module.exports =
  ({ reviewService }) =>
  async (elements) => {
    const rating = reduceToSingleUniqueValue(elements.map((element) => element.rating));
    const restaurantIds = elements.map((arg) => arg.key);

    const dataset = await reviewService.findReviewsByRestaurants(restaurantIds, rating);
    return elements.map((element) => dataset.filter((row) => row.restaurantId == element.key));
  };
