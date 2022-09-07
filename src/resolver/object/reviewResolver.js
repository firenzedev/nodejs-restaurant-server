module.exports = {
  Review: {
    restaurant: (parent, _args, { loaders }) => loaders.restaurants.load(parent.restaurantId),

    replies: (parent, _args, { loaders }) => loaders.reviewReplies.load(parent.id),
  },
};
