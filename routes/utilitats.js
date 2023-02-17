const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const utilitats = require('../controllers/utilitats');
const { isLoggedIn, isResponsable, validateUtilitat } = require('../middlewareUtilitats');
const Utilitat = require('../models/utilitat');

router.route('/')
.get(catchAsync(utilitats.index))
.post(isLoggedIn, validateUtilitat, catchAsync(utilitats.createUtilitat))

router.get('/new', isLoggedIn, utilitats.renderNewForm);

router.route('/:id')
.get(catchAsync(utilitats.showUtilitat))
.put(isLoggedIn, isResponsable, validateUtilitat, catchAsync(utilitats.updateUtilitat))
.delete(isLoggedIn, isResponsable, catchAsync(utilitats.deleteUtilitat));


router.get('/:id/edit', isLoggedIn, isResponsable, catchAsync(utilitats.renderEditForm));


module.exports = router;