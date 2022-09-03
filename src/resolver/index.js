const { merge } = require('lodash');
const queryResolver = require('./root/queryResolver');
const mutationResolver = require('./root/mutationResolver');
const subscriptionResolver = require('./root/subscriptionResolver');
const restaurantResolver = require('./object/restaurantResolver');
const reviewResolver = require('./object/reviewResolver');
const replyResolver = require('./object/replyResolver');

module.exports = merge(
  {},
  queryResolver,
  mutationResolver,
  subscriptionResolver,
  restaurantResolver,
  reviewResolver,
  replyResolver
);
