const express = require("express");
const router = express.Router();
const { createUser } = require("../../../controllers/api/v1/users/create");

// const {
//   serializeUser,
//   deserializeUser,
//   authenticationMiddleware
// } = require("../../../controllers/api/v1/users/authentication");

router.post("/", createUser);

// serializeUser;
// deserializeUser;

module.exports = router;
