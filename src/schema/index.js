const { gql } = require('apollo-server-core');

module.exports = gql`
  type Restaurant {
    id: ID!
    name: String!
    address: String!
    city: String!
    rating: Float
    reviews(rating: Int = 0): [Review]
    numberOfReviews: Int
  }

  type Review {
    id: ID!
    message: String
    rating: Int!
    restaurant: Restaurant!
    replies: [Reply]!
  }

  type Reply {
    id: ID!
    message: String
    review: Review
  }

  type Query {
    restaurants(city: String): [Restaurant!]!
    restaurant(id: ID!): Restaurant
    reviews(restaurantId: ID!): [Review!]!
  }
`;
