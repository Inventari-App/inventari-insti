const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const areas = require('../controllers/areas');
const { isLoggedIn, isResponsable, validateSchema } = require('../middleware');
const { areaSchema } = require('../schemas');
const area = require('../models/area');

const validateArea = validateSchema(areaSchema)

router.route('/')
.get(catchAsync(areas.index))
.post(isLoggedIn, validateArea, catchAsync(areas.createArea))

router.route('/all')
.get(catchAsync(areas.getAreas))

router.get('/new', isLoggedIn, areas.renderNewForm);

router.route('/:id')
.get(catchAsync(areas.showArea))
.put(isLoggedIn, isResponsable(area), validateArea, catchAsync(areas.updateArea))
.delete(isLoggedIn, isResponsable(area), catchAsync(areas.deleteArea));


router.get('/:id/edit', isLoggedIn, isResponsable(area), catchAsync(areas.renderEditForm));


module.exports = router;