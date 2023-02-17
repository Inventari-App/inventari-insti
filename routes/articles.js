const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const articles = require('../controllers/articles');
const { isLoggedIn, isResponsable, validateArticle } = require('../middlewareArticles');
const Article = require('../models/article');

router.route('/')
.get(catchAsync(articles.index))
.post(isLoggedIn, validateArticle, catchAsync(articles.createArticle))

router.get('/new', isLoggedIn, articles.renderNewForm);

router.route('/:id')
.get(catchAsync(articles.showArticle))
.put(isLoggedIn, isResponsable, validateArticle, catchAsync(articles.updateArticle))
.delete(isLoggedIn, isResponsable, catchAsync(articles.deleteArticle));


router.get('/:id/edit', isLoggedIn, isResponsable, catchAsync(articles.renderEditForm));


module.exports = router;