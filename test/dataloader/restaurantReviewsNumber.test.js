const restaurantReviewsNumber = require('../../src/dataloader/restaurantReviewsNumber');

test('restaurantReviewsNumber returns an array of values corresponding to input keys', async () => {
  const db = {
    countReviewsByRestaurants: async () => [
      { restaurantId: 5, count: 123 },
      { restaurantId: 2, count: 42 },
      { restaurantId: 4, count: 1 },
    ],
  };

  const result = await restaurantReviewsNumber(db)([1, 2, 3, 4, 5]);

  expect(result).toStrictEqual([0, 42, 0, 1, 123]);
});
