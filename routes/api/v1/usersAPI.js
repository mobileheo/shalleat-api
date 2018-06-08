const express = require("express");
const router = express.Router();

const create = require("./create");
const login = require("./login");

router.use("/new", create).use("/login", login);

module.exports = router;
