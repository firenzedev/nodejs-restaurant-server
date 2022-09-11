const { Op } = require('sequelize');
const DatabaseSource = require('../../src/datasource/DatabaseSource');

let dbSource;
const models = {
  restaurant: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
  },
  review: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
  },
  reply: {
    findAll: jest.fn(),
    create: jest.fn(),
  },
  sequelize: {
    where: (arg, value) => arg + '=' + value,
    fn: (func, arg) => func + '(' + arg + ')',
    col: (name) => name,
  },
};

beforeEach(() => {
  jest.resetAllMocks();
  dbSource = new DatabaseSource(models);
});

test('DatabaseSource retrieves all the restaurants', async () => {
  const expected = [{ id: 1 }, { id: 2 }, { id: 3 }];
  models.restaurant.findAll.mockImplementation(() => expected);

  const result = await dbSource.findAllRestaurants();

  expect(result).toStrictEqual(expected);
  expect(models.restaurant.findAll).toHaveBeenCalledWith({});
});

test('DatabaseSource retrieves all the restaurants filtering by city', async () => {
  const expected = [{ id: 1 }, { id: 2 }, { id: 3 }];
  models.restaurant.findAll.mockImplementation(() => expected);

  const result = await dbSource.findAllRestaurants('Firenze');

  expect(result).toStrictEqual(expected);
  expect(models.restaurant.findAll.mock.calls[0][0].where).toBe('LOWER(city)=firenze');
});

test('DatabaseSource retrieves a single restaurant', async () => {
  const id = 42;
  const expected = { id };
  models.restaurant.findByPk.mockImplementation(() => expected);

  const result = await dbSource.findRestaurant(id);

  expect(result).toStrictEqual(expected);
  expect(models.restaurant.findByPk).toHaveBeenCalledWith(id);
});

test('DatabaseSource retrieves a list of restaurants from a list of ids', async () => {
  const ids = [1, 2, 3];
  const expected = [{ id: 1 }, { id: 2 }, { id: 3 }];
  models.restaurant.findAll.mockImplementation(() => expected);

  const result = await dbSource.findRestaurants(ids);

  expect(result).toStrictEqual(expected);
  expect(models.restaurant.findAll.mock.calls[0][0].where.id[Op.in]).toStrictEqual(ids);
});

test('DatabaseSource retrieves a list of reviews from a list of restaurant ids', async () => {
  const ids = [1, 2, 3];
  const expected = [{ id: 1 }, { id: 2 }, { id: 3 }];
  models.review.findAll.mockImplementation(() => expected);

  const result = await dbSource.findReviewsByRestaurants(ids);

  expect(result).toStrictEqual(expected);
  expect(models.review.findAll.mock.calls[0][0].where.restaurantId[Op.in]).toStrictEqual(ids);
});

test('DatabaseSource retrieves the list of reviews for a restaurant', async () => {
  const id = 42;
  const expected = [{ id: 1 }, { id: 2 }, { id: 3 }];
  models.review.findAll.mockImplementation(() => expected);

  const result = await dbSource.findReviewsByRestaurant(id);

  expect(result).toStrictEqual(expected);
  expect(models.review.findAll.mock.calls[0][0].where.restaurantId).toBe(id);
});

test('DatabaseSource retrieves the list of reviews for a restaurant, filtering by rating', async () => {
  const id = 42;
  const rating = 4;
  const expected = [{ id: 1 }, { id: 2 }, { id: 3 }];
  models.review.findAll.mockImplementation(() => expected);

  const result = await dbSource.findReviewsByRestaurant(id, rating);

  expect(result).toStrictEqual(expected);
  expect(models.review.findAll.mock.calls[0][0].where.restaurantId).toBe(id);
  expect(models.review.findAll.mock.calls[0][0].where.rating[Op.gte]).toBe(rating);
});

test('DatabaseSource retrieves a list of reviews from a list of restaurant ids, filtering by rating', async () => {
  const ids = [1, 2, 3];
  const rating = 4;
  const expected = [{ id: 1 }, { id: 2 }, { id: 3 }];
  models.review.findAll.mockImplementation(() => expected);

  const result = await dbSource.findReviewsByRestaurants(ids, rating);

  expect(result).toStrictEqual(expected);
  expect(models.review.findAll.mock.calls[0][0].where.restaurantId[Op.in]).toStrictEqual(ids);
  expect(models.review.findAll.mock.calls[0][0].where.rating[Op.gte]).toBe(rating);
});

test('DatabaseSource counts the number of reviews grouped by restaurant ids', async () => {
  const ids = [1, 2, 3];
  const expected = [
    { restaurantId: 1, count: 3 },
    { restaurantId: 3, count: 5 },
  ];
  models.review.count.mockImplementation(() => expected);

  const result = await dbSource.countReviewsByRestaurants(ids);

  expect(result).toStrictEqual(expected);
  expect(models.review.count.mock.calls[0][0].where.restaurantId[Op.in]).toStrictEqual(ids);
});

test('DatabaseSource counts the number of reviews for a restaurant', async () => {
  const id = 42;
  const expected = 123;
  models.review.count.mockImplementation(() => expected);

  const result = await dbSource.countReviewsByRestaurant(id);

  expect(result).toBe(expected);
});

test('DatabaseSource calculates the restaurant average ratings grouped by restaurant ids', async () => {
  const ids = [1, 2, 3];
  const expected = [
    { restaurantId: 1, rating: 3 },
    { restaurantId: 3, rating: 5 },
  ];
  models.review.findAll.mockImplementation(() => expected);

  const result = await dbSource.averageRatingForRestaurants(ids);

  expect(result).toStrictEqual(expected);
  expect(models.review.findAll.mock.calls[0][0].where.restaurantId[Op.in]).toStrictEqual(ids);
  expect(models.review.findAll.mock.calls[0][0].attributes[1]).toStrictEqual(['AVG(rating)', 'rating']);
});

test('DatabaseSource finds the replies associated to a group of review ids', async () => {
  const ids = [1, 2, 3];
  const expected = [{ id: 1 }, { id: 2 }, { id: 3 }];
  models.reply.findAll.mockImplementation(() => expected);

  const result = await dbSource.findRepliesByReviews(ids);

  expect(result).toStrictEqual(expected);
  expect(models.reply.findAll.mock.calls[0][0].where.reviewId[Op.in]).toStrictEqual(ids);
});

test('DatabaseSource finds the replies associated to a review', async () => {
  const id = 42;
  const expected = [{ id: 1 }, { id: 2 }, { id: 3 }];
  models.reply.findAll.mockImplementation(() => expected);

  const result = await dbSource.findRepliesByReview(id);

  expect(result).toStrictEqual(expected);
  expect(models.reply.findAll.mock.calls[0][0].where.reviewId).toBe(id);
});

test('DatabaseSource finds a specific review', async () => {
  const id = 42;
  const expected = { id };
  models.review.findByPk.mockImplementation(() => expected);

  const result = await dbSource.findReview(id);

  expect(result).toStrictEqual(expected);
  expect(models.review.findByPk).toHaveBeenCalledWith(id);
});

test('DatabaseSource finds reviews from a list of ids', async () => {
  const ids = [1, 2, 3];
  const expected = [{ id: 1 }, { id: 2 }, { id: 3 }];
  models.review.findAll.mockImplementation(() => expected);

  const result = await dbSource.findReviews(ids);

  expect(result).toStrictEqual(expected);
  expect(models.review.findAll.mock.calls[0][0].where.id[Op.in]).toStrictEqual(ids);
});

test('DatabaseSource inserts a new review', async () => {
  const id = 42;
  const rating = 5;
  const message = 'message';
  const expected = { id: 1 };
  models.review.create.mockImplementation(() => expected);

  const result = await dbSource.createReview(id, message, rating);

  expect(result).toStrictEqual(expected);
  expect(models.review.create.mock.calls[0][0].restaurantId).toStrictEqual(id);
  expect(models.review.create.mock.calls[0][0].rating).toStrictEqual(rating);
  expect(models.review.create.mock.calls[0][0].message).toStrictEqual(message);
});

test('DatabaseSource inserts a new reply', async () => {
  const id = 42;
  const message = 'message';
  const expected = { id: 1 };
  models.reply.create.mockImplementation(() => expected);

  const result = await dbSource.createReply(id, message);

  expect(result).toStrictEqual(expected);
  expect(models.reply.create.mock.calls[0][0].reviewId).toStrictEqual(id);
  expect(models.reply.create.mock.calls[0][0].message).toStrictEqual(message);
});
