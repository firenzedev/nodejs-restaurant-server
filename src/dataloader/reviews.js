module.exports =
  ({ reviewService }) =>
  async (ids) => {
    const dataset = await reviewService.findReviews(ids);
    return ids.map((id) => dataset.find((row) => row.id == id));
  };
