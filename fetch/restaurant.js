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
  console.log(filters);
  const placeId = `placeid=${id}`;
  const fields = `fields=${filters.join()}`;
  return `${google_place_url}/details/json?${placeId}&${fields}&key=${GOOGLE_PLACE_API}`;
};
const placePhotoUrl = (photoId, maxWidth) => {
  const photoReference = `photoreference=${photoId}`;
  const width = `maxwidth=${maxWidth}`;
  return `${google_place_url}/photo?${width}&${photoReference}&key=${GOOGLE_PLACE_API}`;
};

const getPhoto = async (photoId, maxWidth) => {
  try {
    const { url: photo } = await fetch(placePhotoUrl(photoId, maxWidth));
    return photo;
  } catch (error) {
    console.log(error);
  }
};

// const getPhotos = async (photos, maxWidth, photoUrls = []) => {
//   try {
//     if (photos.length === 0) {
//       return photoUrls;
//     }
//     const { photo_reference: photoId } = photos.pop();
//     const photo = await getPhoto(photoId, maxWidth);
//     photoUrls.push(photo);
//     getPhotos(photos, maxWidth, photoUrls);
//   } catch (error) {
//     console.log(error);
//   }
// };

module.exports = {
  async findNearby(filters) {
    try {
      return await getRests(filters);
    } catch (error) {
      console.log(error);
    }
  },
  async getNext(pageToken) {
    try {
      return await getNextRests(pageToken);
    } catch (error) {
      console.log(error);
    }
  },
  // async getPlaceSchedule(placeId, filters) {
  //   try {
  //     const res = await fetch(placeDetailUrl(placeId, filters));
  //     return await res.json();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },
  async getDetails(placeId, filters) {
    try {
      const res = await fetch(placeDetailUrl(placeId, filters));
      return await res.json();
    } catch (error) {
      console.log(error);
    }
  },
  async getPhoto(photoId, maxWidth) {
    try {
      const photo = await getPhoto(photoId, maxWidth);
      return photo;
    } catch (error) {
      console.log(error);
    }
  },
  async getPhotos(photos, maxWidth, photoUrls = []) {
    if (photos.length === 0) {
      return photoUrls;
    }
    try {
      const { photo_reference: photoId } = photos.pop();
      const photo = await getPhoto(photoId, maxWidth);
      photoUrls.push(photo);
      return await this.getPhotos(photos, maxWidth, photoUrls);
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
