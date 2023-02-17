const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const unitats = require('../controllers/unitats');
const { isLoggedIn, isResponsable, validateUnitat } = require('../middlewareUnitats');
const Unitat = require('../models/unitat');

router.route('/')
.get(catchAsync(unitats.index))
.post(isLoggedIn, validateUnitat, catchAsync(unitats.createUnitat))

router.route('/all')
.get(catchAsync(unitats.getUnitats))

router.get('/new', isLoggedIn, unitats.renderNewForm);

router.route('/:id')
.get(catchAsync(unitats.showUnitat))
.put(isLoggedIn, isResponsable, validateUnitat, catchAsync(unitats.updateUnitat))
.delete(isLoggedIn, isResponsable, catchAsync(unitats.deleteUnitat));


router.get('/:id/edit', isLoggedIn, isResponsable, catchAsync(unitats.renderEditForm));


module.exports = router;