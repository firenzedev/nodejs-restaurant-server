const { gql } = require('apollo-server-core');

module.exports = gql`
  "A restaurant"
  type Restaurant {
    "the id of the restaurant"
    id: ID!
    "the name of the restaurant"
    name: String!
    "the address of the restaurant"
    address: String!
    "the city where the restaurant is"
    city: String!
    "the rating  of the restaurant from 1 to 5"
    rating: Float
    "the reviews of the restaurant"
    reviews("filters the reviews by rating" rating: Int = 0): [Review]
    "the total number of reviews of the restaurant"
    numberOfReviews: Int
  }

  "A review on a restaurant"
  type Review {
    "the id of the review"
    id: ID!
    "A text message, which is the actual content of the review"
    message: String
    "the rating  of the review, from 1 to 5"
    rating: Int!
    "the restaurant the reviews belongs to"
    restaurant: Restaurant!
    replies: [Reply]!
  }

  "The input to insert a review"
  input ReviewInput {
    "A text message, which is the actual content of the review"
    message: String
    "the rating  of the review, from 1 to 5"
    rating: Int!
    "the restaurant id the review will be placed on"
    restaurantId: ID!
  }

  "A reply that can be added to a review"
  type Reply {
    "the id of the reply"
    id: ID!
    "A text message, which is the actual content of the reply"
    message: String
    "the review that holds this reply"
    review: Review
  }

  type Query {
    "returns the list of all the restaurant"
    restaurants("filters by city" city: String): [Restaurant!]!

    "returns a restaurant by its id"
    restaurant("the id of the restaurant to retrieve" id: ID!): Restaurant

    "return all the reviews belonging to a restaurant"
    reviews("the id of the restaurant" restaurantId: ID!): [Review!]!
  }

  type Mutation {
    "Adds a review to a restaurant"
    createReview(input: ReviewInput!): Review!

    "adds a reply to a review"
    addReply(
      "the id of the review"
      reviewId: ID!
      "A text message, which is the actual content of the reply"
      message: String!
    ): Reply!
  }

  type Subscription {
    "Sends a notification every time a new review is added"
    reviewAdded: Review!
  }
`;
