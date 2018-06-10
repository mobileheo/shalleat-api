// const express = require("express");
const router = require("express-promise-router")();
const passport = require("passport");
const passportConfig = require("../../../passport");

const { validateUser, schemas } = require("../../reqValidations");
const {
  signUp,
  signIn,
  secret
} = require("../../../controllers/api/v1/users/users");

router.route("/signup").post(validateUser(schemas.authSchema), signUp);
router.route("/signin").post(signIn);
router
  .route("/secret")
  .get(passport.authenticate("jwt", { session: false }), secret);

module.exports = router;
