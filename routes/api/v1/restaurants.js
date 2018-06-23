// const express = require("express");
const router = require("express-promise-router")();
const passport = require("passport");
const passportConfig = require("../../../passport");

const {
  findAllRestaurants
} = require("../../../controllers/api/v1/restaurants/restaurants");

const passportSignIn = passport.authenticate("local", { session: false });
const passportJWT = passport.authenticate("jwt", { session: false });

router.route("/all").post(passportJWT, findAllRestaurants);

// router
//   .route("/signin")
//   .post(validateSignIn(signInUserSchemas.authSchema), passportSignIn, signIn);

// router.route("/secret").get(passportJWT, secret);

module.exports = router;
