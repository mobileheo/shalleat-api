const express = require('express');
const router = express.Router();
const passport = require("passport");
const session = require("express-session");
const {
  localLogin
} = require('../../../controllers/api/v1/users/create')

  
const {
  serializeUser, deserializeUser, authenticationMiddleware
} = require('../../../controllers/authentication')

router.post("/", localLogin);


serializeUser
deserializeUser


module.exports = router;