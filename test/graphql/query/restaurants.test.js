const {
  mockDb,
  server,
  assertRestaurantEquals,
  getFakeRestaurants,
  getFakeReviews,
} = require('../integrationTestHelper');

beforeEach(() => {
  jest.resetAllMocks();
});

test('restaurants query returns a list of restaurants', async () => {
  const restaurants = getFakeRestaurants();
  mockDb.findAllRestaurants.mockImplementation(() => restaurants);

  const result = await server.executeOperation({
    query: `query GetAllRestaurants { 
              restaurants { 
                id 
                name 
                address 
                city 
              } 
            }`,
  });

  expect(result.errors).toBeUndefined();
  expect(result.data.restaurants.length).toBe(restaurants.length);

  assertRestaurantEquals(restaurants[0], result.data.restaurants[0]);
  assertRestaurantEquals(restaurants[1], result.data.restaurants[1]);
  assertRestaurantEquals(restaurants[2], result.data.restaurants[2]);
});

test('restaurants query returns a list of restaurants, filtered by city', async () => {
  const city = 'City2';
  const restaurants = getFakeRestaurants();
  mockDb.findAllRestaurants.mockImplementation((city) => restaurants.filter((r) => r.city == city));

  const result = await server.executeOperation({
    query: `query GetAllRestaurantsByCity($city: String) { 
              restaurants(city: $city) { 
                id 
                name 
                address 
                city 
              } 
            }`,
    variables: { city },
  });

  expect(result.errors).toBeUndefined();
  expect(result.data.restaurants.length).toBe(1);

  assertRestaurantEquals(restaurants[2], result.data.restaurants[0]);
});

test('restaurants query returns a list of restaurants, each with all its subfields', async () => {
  const restaurants = getFakeRestaurants();
  mockDb.findAllRestaurants.mockImplementation(() => restaurants);

  const reviews = getFakeReviews();
  const reviewsCount = restaurants.map((r) => ({
    restaurantId: r.id,
    count: reviews.filter((w) => w.restaurantId == r.id).length,
  }));
  const ratings = restaurants.map((r) => ({
    restaurantId: r.id,
    rating: reviews
      .filter((w) => w.restaurantId == r.id)
      .map((w) => w.rating)
      .reduce((a, b) => a + b, 0),
  }));
  mockDb.findReviewsByRestaurants.mockImplementation(() => reviews);
  mockDb.countReviewsByRestaurants.mockImplementation(() => reviewsCount);
  mockDb.averageRatingForRestaurants.mockImplementation(() => ratings);

  const result = await server.executeOperation({
    query: `query GetAllRestaurants { 
              restaurants { 
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
  });

  expect(result.errors).toBeUndefined();
  expect(result.data.restaurants.length).toBe(restaurants.length);

  assertRestaurantEquals(restaurants[0], result.data.restaurants[0]);
  expect(result.data.restaurants[0].numberOfReviews).toBe(3);
  expect(result.data.restaurants[0].rating).toBe(9);
  expect(result.data.restaurants[0].reviews.length).toBe(3);
  expect(Number(result.data.restaurants[0].reviews[0].id)).toBe(reviews[0].id);
  expect(Number(result.data.restaurants[0].reviews[1].id)).toBe(reviews[1].id);
  expect(Number(result.data.restaurants[0].reviews[2].id)).toBe(reviews[2].id);

  assertRestaurantEquals(restaurants[1], result.data.restaurants[1]);
  expect(result.data.restaurants[1].numberOfReviews).toBe(0);
  expect(result.data.restaurants[1].rating).toBe(0);
  expect(result.data.restaurants[1].reviews.length).toBe(0);

  assertRestaurantEquals(restaurants[2], result.data.restaurants[2]);
  expect(result.data.restaurants[2].numberOfReviews).toBe(2);
  expect(result.data.restaurants[2].rating).toBe(6);
  expect(result.data.restaurants[2].reviews.length).toBe(2);
  expect(Number(result.data.restaurants[2].reviews[0].id)).toBe(reviews[3].id);
  expect(Number(result.data.restaurants[2].reviews[1].id)).toBe(reviews[4].id);
});

test('restaurants query returns a list of restaurants, each with all its subfields and reviews filtered by rating', async () => {
  const rating = 4;

  const restaurants = getFakeRestaurants();
  mockDb.findAllRestaurants.mockImplementation(() => restaurants);

  const reviews = getFakeReviews();
  const reviewsCount = restaurants.map((r) => ({
    restaurantId: r.id,
    count: reviews.filter((w) => w.restaurantId == r.id).length,
  }));
  const ratings = restaurants.map((r) => ({
    restaurantId: r.id,
    rating: reviews
      .filter((w) => w.restaurantId == r.id)
      .map((w) => w.rating)
      .reduce((a, b) => a + b, 0),
  }));
  mockDb.findReviewsByRestaurants.mockImplementation(() => reviews.filter((r) => r.rating >= rating));
  mockDb.countReviewsByRestaurants.mockImplementation(() => reviewsCount);
  mockDb.averageRatingForRestaurants.mockImplementation(() => ratings);

  const result = await server.executeOperation({
    query: `query GetAllRestaurants { 
              restaurants { 
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
  });

  expect(result.errors).toBeUndefined();
  expect(result.data.restaurants.length).toBe(restaurants.length);

  assertRestaurantEquals(restaurants[0], result.data.restaurants[0]);
  expect(result.data.restaurants[0].numberOfReviews).toBe(3);
  expect(result.data.restaurants[0].rating).toBe(9);
  expect(result.data.restaurants[0].reviews.length).toBe(1);
  expect(Number(result.data.restaurants[0].reviews[0].id)).toBe(reviews[2].id);

  assertRestaurantEquals(restaurants[1], result.data.restaurants[1]);
  expect(result.data.restaurants[1].numberOfReviews).toBe(0);
  expect(result.data.restaurants[1].rating).toBe(0);
  expect(result.data.restaurants[1].reviews.length).toBe(0);

  assertRestaurantEquals(restaurants[2], result.data.restaurants[2]);
  expect(result.data.restaurants[2].numberOfReviews).toBe(2);
  expect(result.data.restaurants[2].rating).toBe(6);
  expect(result.data.restaurants[2].reviews.length).toBe(1);
  expect(Number(result.data.restaurants[2].reviews[0].id)).toBe(reviews[4].id);
});
