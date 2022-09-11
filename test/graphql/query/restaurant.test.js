const {
  mockDb,
  server,
  getFakeRestaurants,
  getFakeReviews,
  getFakeReplies,
  assertRestaurantEquals,
  assertReviewEquals,
  assertReplyEquals,
} = require('../integrationTestHelper');

beforeEach(() => {
  jest.resetAllMocks();
});

test('restaurant query returns the required restaurant', async () => {
  const restaurant = getFakeRestaurants()[0];
  mockDb.findRestaurant.mockImplementation(() => restaurant);

  const result = await server.executeOperation({
    query: `query GetRestaurant($id: ID!) { 
              restaurant(id: $id) { 
                id 
                name 
                address 
                city 
              } 
            }`,
    variables: { id: restaurant.id },
  });

  expect(result.errors).toBeUndefined();

  assertRestaurantEquals(restaurant, result.data.restaurant);
});

test('restaurant query returns the required restaurant, with all its subfields', async () => {
  const restaurant = getFakeRestaurants()[0];
  mockDb.findRestaurant.mockImplementation(() => restaurant);

  const reviews = getFakeReviews(restaurant.id);
  const reviewsCount = [{ restaurantId: restaurant.id, count: reviews.length }];
  const ratings = [{ restaurantId: restaurant.id, rating: reviews.map((w) => w.rating).reduce((a, b) => a + b, 0) }];
  mockDb.findReviewsByRestaurants.mockImplementation(() => reviews);
  mockDb.countReviewsByRestaurants.mockImplementation(() => reviewsCount);
  mockDb.averageRatingForRestaurants.mockImplementation(() => ratings);

  const result = await server.executeOperation({
    query: `query GetRestaurant($id: ID!) { 
              restaurant(id: $id) {
                id 
                name 
                address 
                city 
                numberOfReviews
                rating
                reviews {
                  id
                }
              } 
            }`,
    variables: { id: restaurant.id },
  });

  expect(result.errors).toBeUndefined();

  assertRestaurantEquals(restaurant, result.data.restaurant);
  expect(result.data.restaurant.numberOfReviews).toBe(3);
  expect(result.data.restaurant.rating).toBe(9);

  expect(result.data.restaurant.reviews.length).toBe(3);
  expect(Number(result.data.restaurant.reviews[0].id)).toBe(reviews[0].id);
  expect(Number(result.data.restaurant.reviews[1].id)).toBe(reviews[1].id);
  expect(Number(result.data.restaurant.reviews[2].id)).toBe(reviews[2].id);
});

test('restaurant query returns the required restaurant, with all its subfields and reviews filtered by rating', async () => {
  const rating = 3;
  const restaurant = getFakeRestaurants()[0];
  mockDb.findRestaurant.mockImplementation(() => restaurant);

  const reviews = getFakeReviews(restaurant.id);
  const reviewsCount = [{ restaurantId: restaurant.id, count: reviews.length }];
  const ratings = [{ restaurantId: restaurant.id, rating: reviews.map((w) => w.rating).reduce((a, b) => a + b, 0) }];
  mockDb.findReviewsByRestaurants.mockImplementation(() => reviews.filter((r) => r.rating >= rating));
  mockDb.countReviewsByRestaurants.mockImplementation(() => reviewsCount);
  mockDb.averageRatingForRestaurants.mockImplementation(() => ratings);

  const result = await server.executeOperation({
    query: `query GetRestaurant($id: ID!, $rating: Int) { 
              restaurant(id: $id) {
                id 
                name 
                address 
                city 
                numberOfReviews
                rating
                reviews(rating: $rating) {
                  id
                }
              } 
            }`,
    variables: { id: restaurant.id, rating },
  });

  expect(result.errors).toBeUndefined();

  assertRestaurantEquals(restaurant, result.data.restaurant);
  expect(result.data.restaurant.numberOfReviews).toBe(3);
  expect(result.data.restaurant.rating).toBe(9);

  expect(result.data.restaurant.reviews.length).toBe(2);
  expect(Number(result.data.restaurant.reviews[0].id)).toBe(reviews[1].id);
  expect(Number(result.data.restaurant.reviews[1].id)).toBe(reviews[2].id);
});

test('restaurant query returns the required restaurant, with all its subfields and nested objects', async () => {
  const restaurant = getFakeRestaurants()[0];
  mockDb.findRestaurant.mockImplementation(() => restaurant);

  const reviews = getFakeReviews(restaurant.id);
  const reviewsCount = [{ restaurantId: restaurant.id, count: reviews.length }];
  const ratings = [{ restaurantId: restaurant.id, rating: reviews.map((w) => w.rating).reduce((a, b) => a + b, 0) }];
  mockDb.findReviewsByRestaurants.mockImplementation(() => reviews);
  mockDb.countReviewsByRestaurants.mockImplementation(() => reviewsCount);
  mockDb.averageRatingForRestaurants.mockImplementation(() => ratings);
  mockDb.findRestaurants.mockImplementation(() => [restaurant]);

  const replies = getFakeReplies();
  const reviewIds = replies.map((r) => r.reviewId);
  mockDb.findRepliesByReviews.mockImplementation(() => replies);
  mockDb.findReviews.mockImplementation(() => reviews.filter((r) => reviewIds.includes(r.id)));

  const result = await server.executeOperation({
    query: `query GetRestaurant($id: ID!) { 
              restaurant(id: $id) {
                id 
                name 
                address 
                city 
                numberOfReviews
                rating
                reviews {
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
              } 
            }`,
    variables: { id: restaurant.id },
  });

  expect(result.errors).toBeUndefined();

  assertRestaurantEquals(restaurant, result.data.restaurant);
  expect(result.data.restaurant.numberOfReviews).toBe(3);
  expect(result.data.restaurant.rating).toBe(9);

  expect(result.data.restaurant.reviews.length).toBe(3);

  assertReviewEquals(reviews[0], result.data.restaurant.reviews[0]);
  expect(Number(result.data.restaurant.reviews[0].restaurant.id)).toBe(restaurant.id);
  expect(result.data.restaurant.reviews[0].replies.length).toBe(2);
  assertReplyEquals(replies[0], result.data.restaurant.reviews[0].replies[0]);
  expect(Number(result.data.restaurant.reviews[0].replies[0].review.id)).toBe(reviews[0].id);
  assertReplyEquals(replies[1], result.data.restaurant.reviews[0].replies[1]);
  expect(Number(result.data.restaurant.reviews[0].replies[1].review.id)).toBe(reviews[0].id);

  assertReviewEquals(reviews[1], result.data.restaurant.reviews[1]);
  expect(Number(result.data.restaurant.reviews[1].restaurant.id)).toBe(restaurant.id);
  expect(result.data.restaurant.reviews[1].replies.length).toBe(1);
  assertReplyEquals(replies[2], result.data.restaurant.reviews[1].replies[0]);
  expect(Number(result.data.restaurant.reviews[1].replies[0].review.id)).toBe(reviews[1].id);

  assertReviewEquals(reviews[2], result.data.restaurant.reviews[2]);
  expect(Number(result.data.restaurant.reviews[2].restaurant.id)).toBe(restaurant.id);
  expect(result.data.restaurant.reviews[2].replies.length).toBe(0);
});
