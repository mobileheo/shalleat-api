const express = require('express');
const router = express.Router();

const create = require('./create');

router
  .use('/new', create);

module.exports = router

