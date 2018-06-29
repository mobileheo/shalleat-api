// const express = require("express");
const router = require("express-promise-router")();
const passport = require("passport");
const passportConfig = require("../../../passport");

const {
  findAllRestaurants,
  getNextRests,
  getRestaurantSchedule
} = require("../../../controllers/api/v1/restaurants/restaurants");

const passportJWT = passport.authenticate("jwt", { session: false });

router.route("/all").post(passportJWT, findAllRestaurants);
router.route("/next").post(passportJWT, getNextRests);
router.route("/schedule").post(passportJWT, getRestaurantSchedule);

module.exports = router;
