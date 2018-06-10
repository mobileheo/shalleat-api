// const express = require("express");
const router = require("express-promise-router")();
const passport = require("passport");
const passportConfig = require("../../../passport");

const { validateUser, schemas } = require("../../reqValidations");
const UsersController = require("../../../controllers/api/v1/users/users");

router
  .route("/signup")
  .post(validateUser(schemas.authSchema), UsersController.signUp);
router.route("/signin").post(UsersController.signIn);
router
  .route("/secret")
  .get(
    passport.authenticate("jwt", { session: false }),
    UsersController.secret
  );

module.exports = router;
