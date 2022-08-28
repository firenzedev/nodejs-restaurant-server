module.exports = {
  Review: {
    restaurant: (parent, _args, { dataSources }) => dataSources.db.findRestaurant(parent.restaurantId),
    replies: (parent, _args, { dataSources }) => dataSources.db.findRepliesByReview(parent.id),
  },
};
