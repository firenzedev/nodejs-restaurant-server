module.exports =
  ({ restaurantService }) =>
  async (ids) => {
    const dataset = await restaurantService.findRestaurants(ids);
    return ids.map((id) => dataset.find((row) => row.id == id));
  };
