// const express = require("express");
const router = require("express-promise-router")();
const passport = require("passport");
const passportConfig = require("../../../passport");

const {
  findAllRestaurants,
  getNextRests,
  getRestaurantSchedule,
  getDetail,
  getDetails,
  getPhoto,
  getPhotos,
  getBusyHours
} = require("../../../controllers/api/v1/restaurants/restaurants");

const passportJWT = passport.authenticate("jwt", { session: false });

// router.route("/all").post(passportJWT, findAllRestaurants);
router.route("/all").post(findAllRestaurants);
router.route("/next").post(passportJWT, getNextRests);
// router.route("/schedule").post(passportJWT, getRestaurantSchedule);
router.route("/detail").post(passportJWT, getDetail);
router.route("/details").post(passportJWT, getDetails);
router.route("/photo").post(passportJWT, getPhoto);
router.route("/photos").post(passportJWT, getPhotos);
router.route("/busyhours").post(passportJWT, getBusyHours);

module.exports = router;
