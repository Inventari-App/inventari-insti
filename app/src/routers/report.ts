const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const report = require("../controllers/reports");

router.route("/")
  .get(catchAsync(report.index));

router.route("/show")
  .get(catchAsync(report.show));

module.exports = router;
