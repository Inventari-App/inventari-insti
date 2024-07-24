const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const centre = require('../controllers/centre')

router.route('/')
  .get(catchAsync(centre.index))

module.exports = router
