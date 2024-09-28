import express from "express";
import catchAsync from "../utils/catchAsync";
import * as articles from "../controllers/articles";
import {
  isLoggedIn,
  isResponsableOrAdmin,
  validateSchema,
} from "../middleware";
import { articlesSchema, articleSchema } from "../schemas";
import article from "../models/article";

const router = express.Router();

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

export default router;

