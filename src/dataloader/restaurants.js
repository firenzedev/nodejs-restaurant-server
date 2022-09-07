module.exports = (db) => async (ids) => {
  const dataset = await db.findRestaurants(ids);
  return ids.map((id) => dataset.find((row) => row.id === id));
};
