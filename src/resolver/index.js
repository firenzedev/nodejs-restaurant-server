const { merge } = require('lodash');
const replyResolver = require('./object/replyResolver');
const restaurantResolver = require('./object/restaurantResolver');
const reviewResolver = require('./object/reviewResolver');
const queryResolver = require('./root/queryResolver');

module.exports = merge({}, queryResolver, restaurantResolver, reviewResolver, replyResolver);
