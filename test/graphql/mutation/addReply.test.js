const { mockDb, server, getFakeReplies, assertReplyEquals } = require('../integrationTestHelper');

beforeEach(() => {
  jest.resetAllMocks();
});

test('addReply mutation adds a new reply', async () => {
  const reply = getFakeReplies()[0];
  mockDb.createReply.mockImplementation(() => reply);

  const result = await server.executeOperation({
    query: `mutation AddReply($reviewId: ID!, $message: String!) { 
              addReply(reviewId: $reviewId, message: $message) { 
                id 
                message
              } 
            }`,
    variables: { reviewId: reply.reviewId, message: reply.message },
  });

  expect(result.errors).toBeUndefined();

  assertReplyEquals(reply, result.data.addReply);
});
