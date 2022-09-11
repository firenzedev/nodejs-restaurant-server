const restaurantAverageRating = require('../../src/dataloader/restaurantAverageRating');

test('restaurantAverageRating returns an array of values corresponding to input keys', async () => {
  const db = {
    averageRatingForRestaurants: async () => [
      { restaurantId: 5, rating: 1.2 },
      { restaurantId: 2, rating: 5.3 },
      { restaurantId: 4, rating: 4.8 },
    ],
  };

  const result = await restaurantAverageRating(db)([1, 2, 3, 4, 5]);

  expect(result).toStrictEqual([0, 5.3, 0, 4.8, 1.2]);
});
