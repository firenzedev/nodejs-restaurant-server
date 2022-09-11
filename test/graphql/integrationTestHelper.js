const typeDefs = require('../../src/schema');
const resolvers = require('../../src/resolver');
const dataLoaderBuilder = require('../../src/dataloader');
const GraphQLServer = require('../../src/server');

const mockDb = {
  findAllRestaurants: jest.fn(),
  findRestaurant: jest.fn(),
  findRestaurants: jest.fn(),
  findReviewsByRestaurants: jest.fn(),
  countReviewsByRestaurants: jest.fn(),
  averageRatingForRestaurants: jest.fn(),
  findReviewsByRestaurant: jest.fn(),
  findRepliesByReviews: jest.fn(),
  findReviews: jest.fn(),
  createReview: jest.fn(),
  createReply: jest.fn(),
};

const server = GraphQLServer({
  typeDefs,
  resolvers,
  sources: {
    db: mockDb,
  },
  loaders: dataLoaderBuilder(mockDb),
});

const getFakeRestaurants = () => {
  return [
    { id: 1, name: 'One', address: 'One Street', city: 'City1' },
    { id: 2, name: 'Two', address: 'Two Street', city: 'City1' },
    { id: 3, name: 'Three', address: 'Three Street', city: 'City2' },
  ];
};

const getFakeReviews = (restaurantId) => {
  const reviews = [
    { id: 101, restaurantId: 1, rating: 1, message: 'One' },
    { id: 102, restaurantId: 1, rating: 3, message: 'Two' },
    { id: 103, restaurantId: 1, rating: 5, message: 'Three' },
    { id: 104, restaurantId: 3, rating: 2, message: 'Four' },
    { id: 105, restaurantId: 3, rating: 4, message: 'Five' },
  ];

  if (restaurantId) {
    return reviews.filter((r) => r.restaurantId == restaurantId);
  }

  return reviews;
};

const getFakeReplies = () => {
  return [
    { id: 201, reviewId: 101, message: 'ReplyOne' },
    { id: 202, reviewId: 101, message: 'ReplyTwo' },
    { id: 203, reviewId: 102, message: 'ReplyThree' },
  ];
};

const assertRestaurantEquals = (expected, actual) => {
  expect(Number(actual.id)).toBe(expected.id);
  expect(actual.name).toBe(expected.name);
  expect(actual.address).toBe(expected.address);
  expect(actual.city).toBe(expected.city);
};

const assertReviewEquals = (expected, actual) => {
  expect(Number(actual.id)).toBe(expected.id);
  expect(actual.message).toBe(expected.message);
  expect(actual.rating).toBe(expected.rating);
};

const assertReplyEquals = (expected, actual) => {
  expect(Number(actual.id)).toBe(expected.id);
  expect(actual.message).toBe(expected.message);
};

module.exports = {
  mockDb,
  server: server.instance,
  getFakeRestaurants,
  getFakeReviews,
  getFakeReplies,
  assertRestaurantEquals,
  assertReviewEquals,
  assertReplyEquals,
};
