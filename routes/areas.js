const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const areas = require('../controllers/areas');
const { isLoggedIn, isResponsable, validateArea } = require('../middlewareAreas');
const Area = require('../models/area');

router.route('/')
.get(catchAsync(areas.index))
.post(isLoggedIn, validateArea, catchAsync(areas.createArea))

router.route('/all')
.get(catchAsync(areas.getAreas))

router.get('/new', isLoggedIn, areas.renderNewForm);

router.route('/:id')
.get(catchAsync(areas.showArea))
.put(isLoggedIn, isResponsable, validateArea, catchAsync(areas.updateArea))
.delete(isLoggedIn, isResponsable, catchAsync(areas.deleteArea));


router.get('/:id/edit', isLoggedIn, isResponsable, catchAsync(areas.renderEditForm));


module.exports = router;