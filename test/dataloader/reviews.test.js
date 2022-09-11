const reviews = require('../../src/dataloader/reviews');

test('reviews returns an array of values corresponding to input keys', async () => {
  const db = {
    findReviews: async () => [{ id: 2 }, { id: 1 }, { id: 5 }, { id: 3 }],
  };

  const result = await reviews(db)([1, 2, 3, 4, 5]);

  expect(result).toStrictEqual([{ id: 1 }, { id: 2 }, { id: 3 }, undefined, { id: 5 }]);
});
