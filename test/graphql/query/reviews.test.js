const {
  mockDb,
  server,
  getFakeRestaurants,
  getFakeReviews,
  getFakeReplies,
  assertReviewEquals,
  assertReplyEquals,
} = require('../integrationTestHelper');

beforeEach(() => {
  jest.resetAllMocks();
});

test('reviews query returns the list of reviews for a restaurant', async () => {
  const restaurantId = 1;
  const reviews = getFakeReviews(restaurantId);
  mockDb.findReviewsByRestaurant.mockImplementation(() => reviews);

  const result = await server.executeOperation({
    query: `query GetReviews($restaurantId: ID!) { 
              reviews(restaurantId: $restaurantId) { 
                id 
                message
                rating
              } 
            }`,
    variables: { restaurantId },
  });

  expect(result.errors).toBeUndefined();

  expect(result.data.reviews.length).toBe(3);
  assertReviewEquals(reviews[0], result.data.reviews[0]);
  assertReviewEquals(reviews[1], result.data.reviews[1]);
  assertReviewEquals(reviews[2], result.data.reviews[2]);
});

test('reviews query returns the list of reviews for a restaurant, with all its subfields and nested objects', async () => {
  const restaurantId = 1;
  const reviews = getFakeReviews(restaurantId);
  mockDb.findReviewsByRestaurant.mockImplementation(() => reviews);

  const restaurant = getFakeRestaurants()[0];
  mockDb.findRestaurants.mockImplementation(() => [restaurant]);

  const replies = getFakeReplies();
  const reviewIds = replies.map((r) => r.reviewId);
  mockDb.findRepliesByReviews.mockImplementation(() => replies);
  mockDb.findReviews.mockImplementation(() => reviews.filter((r) => reviewIds.includes(r.id)));

  const result = await server.executeOperation({
    query: `query GetReviews($restaurantId: ID!) { 
              reviews(restaurantId: $restaurantId) { 
                id 
                message
                rating
                restaurant {
                  id
                }
                replies {
                  id
                  message
                  review {
                    id
                  }
                }
              } 
            }`,
    variables: { restaurantId },
  });

  expect(result.errors).toBeUndefined();

  expect(result.data.reviews.length).toBe(3);

  assertReviewEquals(reviews[0], result.data.reviews[0]);
  expect(Number(result.data.reviews[0].restaurant.id)).toBe(restaurantId);
  expect(result.data.reviews[0].replies.length).toBe(2);
  assertReplyEquals(replies[0], result.data.reviews[0].replies[0]);
  assertReplyEquals(replies[1], result.data.reviews[0].replies[1]);

  assertReviewEquals(reviews[1], result.data.reviews[1]);
  expect(Number(result.data.reviews[1].restaurant.id)).toBe(restaurantId);
  expect(result.data.reviews[1].replies.length).toBe(1);
  assertReplyEquals(replies[2], result.data.reviews[1].replies[0]);

  assertReviewEquals(reviews[2], result.data.reviews[2]);
  expect(Number(result.data.reviews[2].restaurant.id)).toBe(restaurantId);
  expect(result.data.reviews[2].replies.length).toBe(0);
});
