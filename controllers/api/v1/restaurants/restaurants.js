const Restaurant = require("../../../../fetch/restaurant");

module.exports = {
  findAllRestaurants: async (req, res, next) => {
    const { user } = req;
    const filters = req.body;
    try {
      const restaurants = await Restaurant.findNearby(filters);
      res.status(200).json(restaurants);
    } catch (error) {
      console.log(error);
    }
  }
};
