const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const inventaris = require("../controllers/inventaris");
const {
  isLoggedIn,
  isResponsableOrAdmin,
  validateSchema,
} = require("../middleware");
const { inventarisSchema, inventariSchema } = require("../schemas");
const inventari = require("../models/inventari");

const validateInventaris = validateSchema(inventarisSchema);
const validateInventari = validateSchema(inventariSchema);

router
  .route("/")
  .get(catchAsync(inventaris.index))
  .post(
    isLoggedIn,
    validateInventaris,
    catchAsync(inventaris.createInventaris),
  );

router.get("/new", isLoggedIn, inventaris.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(inventaris.showInventari))
  .put(
    isLoggedIn,
    isResponsableOrAdmin(inventari),
    validateInventari,
    catchAsync(inventaris.updateInventari),
  )
  .delete(
    isLoggedIn,
    isResponsableOrAdmin(inventari),
    catchAsync(inventaris.deleteInventari),
  );

router.get(
  "/:id/edit",
  isLoggedIn,
  isResponsableOrAdmin(inventari),
  catchAsync(inventaris.renderEditForm),
);

module.exports = router;
