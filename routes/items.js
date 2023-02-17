const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const items = require('../controllers/items');
const { isLoggedIn, isResponsable, validateItem } = require('../middlewareItems');
const Item = require('../models/item');

router.route('/')
.get(catchAsync(items.index))
.post(isLoggedIn, validateItem, catchAsync(items.createItem))

router.route('/all')
.get(catchAsync(items.getItems))

router.get('/new', isLoggedIn, items.renderNewForm);

router.route('/:id')
.get(catchAsync(items.showItem))
.put(isLoggedIn, isResponsable, validateItem, catchAsync(items.updateItem))
.delete(isLoggedIn, isResponsable, catchAsync(items.deleteItem));


router.get('/:id/edit', isLoggedIn, isResponsable, catchAsync(items.renderEditForm));


module.exports = router;