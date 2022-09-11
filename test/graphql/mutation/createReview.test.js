const { mockDb, server, getFakeReviews, assertReviewEquals } = require('../integrationTestHelper');

beforeEach(() => {
  jest.resetAllMocks();
});

test('createReview mutation adds a new review', async () => {
  const review = getFakeReviews()[0];
  mockDb.createReview.mockImplementation(() => review);

  const result = await server.executeOperation({
    query: `mutation CreateReview($reviewInput: ReviewInput!) { 
              createReview(input: $reviewInput) { 
                id 
                message
                rating
              } 
            }`,
    variables: {
      reviewInput: {
        message: review.message,
        rating: review.rating,
        restaurantId: review.restaurantId,
      },
    },
  });

  expect(result.errors).toBeUndefined();

  assertReviewEquals(review, result.data.createReview);
});
