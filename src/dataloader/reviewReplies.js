module.exports = (db) => async (reviewIds) => {
  const dataset = await db.findRepliesByReviews(reviewIds);
  return reviewIds.map((id) => dataset.filter((row) => row.reviewId === id));
};
