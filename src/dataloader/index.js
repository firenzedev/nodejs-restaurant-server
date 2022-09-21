const DataLoader = require('dataloader');
const restaurants = require('./restaurants');
const restaurantAverageRating = require('./restaurantAverageRating');
const restaurantReviewsNumber = require('./restaurantReviewsNumber');
const restaurantReviewsWithRating = require('./restaurantReviewsWithRating');
const reviews = require('./reviews');
const reviewReplies = require('./reviewReplies');

module.exports = (services) => ({
  restaurants: new DataLoader(restaurants(services)),
  restaurantAverageRating: new DataLoader(restaurantAverageRating(services)),
  restaurantReviewsNumber: new DataLoader(restaurantReviewsNumber(services)),
  restaurantReviewsWithRating: new DataLoader(restaurantReviewsWithRating(services)),
  reviews: new DataLoader(reviews(services)),
  reviewReplies: new DataLoader(reviewReplies(services)),
});
