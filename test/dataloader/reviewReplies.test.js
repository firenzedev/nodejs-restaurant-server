const reviewReplies = require('../../src/dataloader/reviewReplies');

test('reviewReplies returns an array of values corresponding to input keys', async () => {
  const db = {
    findRepliesByReviews: async () => [
      { reviewId: 4, id: 423 },
      { reviewId: 2, id: 221 },
      { reviewId: 3, id: 335 },
      { reviewId: 3, id: 399 },
      { reviewId: 4, id: 476 },
    ],
  };

  const result = await reviewReplies(db)([1, 2, 3, 4, 5]);

  expect(result).toStrictEqual([
    [],
    [{ reviewId: 2, id: 221 }],
    [
      { reviewId: 3, id: 335 },
      { reviewId: 3, id: 399 },
    ],
    [
      { reviewId: 4, id: 423 },
      { reviewId: 4, id: 476 },
    ],
    [],
  ]);
});
