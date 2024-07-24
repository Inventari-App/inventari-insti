const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const articles = require("../controllers/articles");
const {
  isLoggedIn,
  isResponsableOrAdmin,
  validateSchema,
} = require("../middleware");
const { articlesSchema, articleSchema } = require("../schemas");
const article = require("../models/article");

const validateArticles = validateSchema(articlesSchema);
const validateArticle = validateSchema(articleSchema);

router
  .route("/")
  .get(catchAsync(articles.index))
  .post(
    isLoggedIn,
    validateArticles,
    catchAsync(articles.createArticles),
  );

router.get("/new", isLoggedIn, articles.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(articles.showArticle))
  .put(
    isLoggedIn,
    isResponsableOrAdmin(article),
    validateArticle,
    catchAsync(articles.updateArticle),
  )
  .delete(
    isLoggedIn,
    isResponsableOrAdmin(article),
    catchAsync(articles.deleteArticle),
  );

router.get(
  "/:id/edit",
  isLoggedIn,
  isResponsableOrAdmin(article),
  catchAsync(articles.renderEditForm),
);

module.exports = router;
