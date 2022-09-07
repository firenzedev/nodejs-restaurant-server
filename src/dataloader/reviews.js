module.exports = (db) => async (ids) => {
  const dataset = await db.findReviews(ids);
  return ids.map((id) => dataset.find((row) => row.id == id));
};
