const fetch = require("node-fetch");
const busyHours = require("busy-hours");
const { GOOGLE_PLACE_API } = require("../config/authConfig");
const google_place_url = "https://maps.googleapis.com/maps/api/place";

const nearbySearchUrl = filters => {
  const { lat, lng, radius, typeKeyword } = filters;
  return typeKeyword
    ? `${google_place_url}/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=restaurant&keyword=${typeKeyword}&key=${GOOGLE_PLACE_API}`
    : `${google_place_url}/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=restaurant&key=${GOOGLE_PLACE_API}`;
};

const getRests = async filters => {
  try {
    const res = await fetch(nearbySearchUrl(filters));
    return await res.json();
  } catch (error) {
    console.log(error);
  }
};

// const getNextRests = async () => {
//   try {
//     const tokenURL = `${google_place_url}/nearbysearch/json?pagetoken=${pageToken}&key=${GOOGLE_PLACE_API}`;
//     const res = await fetch(tokenURL);
//     const nextRestaurants = await res.json();
//     const { next_page_token } = nextRestaurants;

//     pageToken = next_page_token;
//     allRestaurants = allRestaurants.concat(nextRestaurants.results);
//     if (!pageToken) return allRestaurants;
//     else {
//       return await getNextRests();
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };
const getNextRests = async pageToken => {
  try {
    const tokenURL = `${google_place_url}/nearbysearch/json?pagetoken=${pageToken}&key=${GOOGLE_PLACE_API}`;
    const res = await fetch(tokenURL);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
};
const placeDetailUrl = (id, filters) => {
  const placeId = `placeid=${id}`;
  const fields = `fields=${filters.join()}`;
  return `${google_place_url}/details/json?${placeId}&${fields}&key=${GOOGLE_PLACE_API}`;
};

module.exports = {
  async findNearby(filters) {
    try {
      console.log(filters);
      return await getRests(filters);
    } catch (error) {
      console.log(error);
    }
  },
  async getNext(pageToken) {
    try {
      console.log("pageToken => ", pageToken);
      return await getNextRests(pageToken);
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
  },
  async getDetails(placeId, filters) {
    try {
      const res = await fetch(placeDetailUrl(placeId, filters));
      return await res.json();
    } catch (error) {
      console.log(error);
    }
  },
  async getBusyHours(placeId) {
    const data = await busyHours(placeId, GOOGLE_PLACE_API);
    console.log(data);
    return data;
  }
};
