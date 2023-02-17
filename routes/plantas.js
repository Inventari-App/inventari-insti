const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const plantas = require('../controllers/plantas');
const { isLoggedIn, isResponsable, validatePlanta } = require('../middlewarePlantas');
const Planta = require('../models/planta');

router.route('/')
.get(catchAsync(plantas.index))
.post(isLoggedIn, validatePlanta, catchAsync(plantas.createPlanta))

router.route('/all')
.get(catchAsync(plantas.getPlantas))

router.get('/new', isLoggedIn, plantas.renderNewForm);

router.route('/:id')
.get(catchAsync(plantas.showPlanta))
.put(isLoggedIn, isResponsable, validatePlanta, catchAsync(plantas.updatePlanta))
.delete(isLoggedIn, isResponsable, catchAsync(plantas.deletePlanta));


router.get('/:id/edit', isLoggedIn, isResponsable, catchAsync(plantas.renderEditForm));


module.exports = router;