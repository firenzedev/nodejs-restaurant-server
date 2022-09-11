const restaurants = require('../../src/dataloader/restaurants');

test('restaurants returns an array of values corresponding to input keys', async () => {
  const db = {
    findRestaurants: async () => [{ id: 2 }, { id: 1 }, { id: 5 }, { id: 3 }],
  };

  const result = await restaurants(db)([1, 2, 3, 4, 5]);

  expect(result).toStrictEqual([{ id: 1 }, { id: 2 }, { id: 3 }, undefined, { id: 5 }]);
});
