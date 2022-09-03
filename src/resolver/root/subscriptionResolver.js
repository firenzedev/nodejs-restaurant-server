module.exports = {
  Subscription: {
    reviewAdded: {
      subscribe: (_parent, _args, { pubSub }) => pubSub.asyncIterator('REVIEW_ADDED'),
    },
  },
};
