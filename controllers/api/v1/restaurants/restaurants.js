const Restaurant = require("../../../../fetch/restaurant");

module.exports = {
  findAllRestaurants: async (req, res, next) => {
    // const { user } = req;
    const filters = req.body;
    try {
      const restaurants = await Restaurant.findNearby(filters);
      res.status(200).json(restaurants);
    } catch (error) {
      console.log(error);
    }
  },
  getRestaurantDetail: async (req, res, next) => {
    try {
      console.log(req.body);
      const { placeId, filters } = req.body;
      const restaruantDetail = await Restaurant.getPlaceDetail(
        placeId,
        filters
      );
      res.status(200).json(restaruantDetail);
    } catch (error) {
      console.log(error);
    }
  }
};
