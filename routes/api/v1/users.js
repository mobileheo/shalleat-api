// const express = require("express");
const router = require("express-promise-router")();
const passport = require("passport");
const passportConfig = require("../../../passport");

const {
  validateNewUser,
  validateSignIn,
  newUserSchemas,
  signInUserSchemas
} = require("../../reqValidations");
const {
  signUp,
  signIn,
  secret
} = require("../../../controllers/api/v1/users/users");
const passportSignIn = passport.authenticate("local", { session: false });
const passportJWT = passport.authenticate("jwt", { session: false });

router
  .route("/signup")
  .post(validateNewUser(newUserSchemas.authSchema), signUp);
router
  .route("/signin")
  .post(validateSignIn(signInUserSchemas.authSchema), passportSignIn, signIn);
router.route("/secret").get(passportJWT, secret);

module.exports = router;
