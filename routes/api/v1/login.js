const express = require("express");
const router = express.Router();
const passport = require("passport");
const login = require("../../../controllers/api/v1/users/login");

/*Local stratgey*/
router.post("/", passport.authenticate("local"), login);

module.exports = router;
