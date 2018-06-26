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
      const restaurants = await res.json();
      const { next_page_token } = restaurants;
      if (next_page_token) {
        // console.log(next_page_token);
        const newRes = await fetch(
          // `${google_place_url}/nearbysearch/json?pagetoken=${next_page_token}&key=${GOOGLE_PLACE_API}`
          `${google_place_url}/nearbysearch/json?pagetoken=CrQCJQEAANyRPdSl1ca-roZxYwMVIQuQc1D3vjjGNcuhCenFHTs5dIIt9TQxlIFRCQRA6H4CKVZq02Wi6kJezDwsT67tZ1DhS-WyCPlAK-BBV8SN2rWhT47_L7-8gagHmw3J905crkFMC_GpF8lfI62vBgw-_bVZ9lKK9BxiyJhHhtb9XhYHOoGsoBBK0S2cSF-BVs6g39EfS8GwDtFfd6GRMsX8iPj8RgQmqnyEDxDZIZZKgDfhNDsSmmFO-sDDFLFuhSScyJ98ePwbxVqCOwNRD1GlF9NrJoZGf37RBgEKe1w7qT2Mte_F4VLoOFSbqafeBbHNtk3mRSMx5o4zwvE9qDJsRByyVm3vPl-K1YFkbKynAz9jG1J8oJ76fZxNDLAoo22wOQw4bEmA6-OqCSzZXr8NiHgSEEGD-SULOqYXE-AFK7leGlsaFIk48jxr6RGSNw_DJWZ56edD2NZy&key=AIzaSyDiUwhjWUpsEUR9OixbMgEVp8Hdsmrv_tg`
        );
        const foo = await newRes.json();
        console.log(foo);
        return foo;
      }
      return restaurants;
    } catch (error) {
      console.log(error);
    }
  },
  async getPlaceSchedule(placeId, filters) {
    try {
      const res = await fetch(placeDetailUrl(placeId, filters));
      return await res.json();
    } catch (error) {
      console.log(error);
    }
  }
};
