const DataLoader = require('dataloader');
const restaurants = require('./restaurants');
const restaurantAverageRating = require('./restaurantAverageRating');
const restaurantReviewsNumber = require('./restaurantReviewsNumber');
const restaurantReviewsWithRating = require('./restaurantReviewsWithRating');
const reviews = require('./reviews');
const reviewReplies = require('./reviewReplies');

module.exports = (db) => ({
  restaurants: new DataLoader(restaurants(db)),
  restaurantAverageRating: new DataLoader(restaurantAverageRating(db)),
  restaurantReviewsNumber: new DataLoader(restaurantReviewsNumber(db)),
  restaurantReviewsWithRating: new DataLoader(restaurantReviewsWithRating(db)),
  reviews: new DataLoader(reviews(db)),
  reviewReplies: new DataLoader(reviewReplies(db)),
});
