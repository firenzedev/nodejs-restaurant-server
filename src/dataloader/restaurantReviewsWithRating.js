module.exports = (db) => async (elements) => {
  const rating = elements
    .map((element) => element.rating)
    .filter((x, i, a) => a.indexOf(x) === i)
    .reduce((a, b) => {
      throw new Error('should have only one arg');
    });
  const dataset = await db.findReviewsByRestaurants(
    elements.map((arg) => arg.key),
    rating
  );
  return elements.map((element) => dataset.filter((review) => review.restaurantId === element.key));
};
