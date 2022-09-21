module.exports =
  ({ replyService }) =>
  async (reviewIds) => {
    const dataset = await replyService.findRepliesByReviews(reviewIds);
    return reviewIds.map((id) => dataset.filter((row) => row.reviewId == id));
  };
