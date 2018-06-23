const fetch = require("node-fetch");
const { GOOGLE_PLACE_API } = require("../config/authConfig");
const google_place_url = "https://maps.googleapis.com/maps/api/place";
// &fields=name,rating,opening_hours&key=AIzaSyDiUwhjWUpsEUR9OixbMgEVp8Hdsmrv_tg
// var url =
// "https://maps.googleapis.com/maps/api/place/nearbysearch/json?" +
// "key=" +
// key +
// "&location=" +
// location +
// "&radius=" +
// radius +
// "&sensor=" +``
// sensor +
// "&types=" +
// types +
// "&keyword=" +
// keyword;

const nearbySearchUrl = filters => {
  const { lat, lng, radius } = filters;
  return `${google_place_url}/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=restaurant&key=${GOOGLE_PLACE_API}`;
};
const placeDetailUrl = (id, filters) => {
  const placeId = `placeid=${id}`;
  const fields = `fields=${filters.join()}`;
  return `${google_place_url}/details/json?${placeId}&${fields}&key=${GOOGLE_PLACE_API}`;
};

module.exports = {
  async findNearby(filters) {
    try {
      const res = await fetch(nearbySearchUrl(filters));
      return await res.json();
    } catch (error) {
      console.log(error);
    }
  },
  async getPlaceDetail(placeId, filters) {
    try {
      const res = await fetch(placeDetailUrl(placeId, filters));
      return await res.json();
    } catch (error) {
      console.log(error);
    }
  }
};
