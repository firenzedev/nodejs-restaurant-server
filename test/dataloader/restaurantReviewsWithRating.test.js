const restaurantReviewsWithRating = require('../../src/dataloader/restaurantReviewsWithRating');

test('restaurantReviewsWithRating returns an array of values corresponding to input keys', async () => {
  const db = {
    findReviewsByRestaurants: async () => [
      { restaurantId: 4, reviewId: 423 },
      { restaurantId: 1, reviewId: 123 },
      { restaurantId: 1, reviewId: 135 },
      { restaurantId: 4, reviewId: 401 },
      { restaurantId: 2, reviewId: 277 },
      { restaurantId: 4, reviewId: 499 },
    ],
  };

  const result = await restaurantReviewsWithRating(db)([
    { key: 1, rating: 3 },
    { key: 2, rating: 3 },
    { key: 3, rating: 3 },
    { key: 4, rating: 3 },
    { key: 5, rating: 3 },
  ]);

  expect(result).toStrictEqual([
    [
      { restaurantId: 1, reviewId: 123 },
      { restaurantId: 1, reviewId: 135 },
    ],
    [{ restaurantId: 2, reviewId: 277 }],
    [],
    [
      { restaurantId: 4, reviewId: 423 },
      { restaurantId: 4, reviewId: 401 },
      { restaurantId: 4, reviewId: 499 },
    ],
    [],
  ]);
});

test('restaurantReviewsWithRating throws error if required ratings are different', async () => {
  const arg = [
    { key: 1, rating: 3 },
    { key: 2, rating: 2 },
    { key: 3, rating: 4 },
    { key: 4, rating: 0 },
    { key: 5, rating: 5 },
  ];

  await expect(async () => {
    await restaurantReviewsWithRating({})(arg);
  }).rejects.toThrow();
});
