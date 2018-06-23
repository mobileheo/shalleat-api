const fetch = require("node-fetch");
const { GOOGLE_PLACE_API } = require("../config/authConfig");
const google_place_url = "https://maps.googleapis.com/maps/api/place";

const nearbySearchUrl = filters => {
  const { lat, lng, radius } = filters;
  return `${google_place_url}/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=restaurant&key=${GOOGLE_PLACE_API}`;
};

module.exports = {
  async findNearby(filters) {
    try {
      const res = await fetch(nearbySearchUrl(filters));
      const restaurants = await res.json();
      return restaurants;
    } catch (error) {
      console.log(error);
    }
  }
};
