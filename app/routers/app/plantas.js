const express = require('express');
const router = express.Router();
const catchAsync = require('../../utils/catchAsync');
const plantas = require('../../controllers/plantas');
const { isLoggedIn, isResponsable, validateSchema } = require('../../middleware');
const { plantaSchema } = require('../../schemas');
const planta = require('../../models/planta');

const validatePlanta = validateSchema(plantaSchema)

router.route('/')
.get(catchAsync(plantas.index))
.post(isLoggedIn, validatePlanta, catchAsync(plantas.createPlanta))

router.route('/all')
.get(catchAsync(plantas.getPlantas))

router.get('/new', isLoggedIn, plantas.renderNewForm);

router.route('/:id')
.get(catchAsync(plantas.showPlanta))
.put(isLoggedIn, isResponsable(planta), validatePlanta, catchAsync(plantas.updatePlanta))
.delete(isLoggedIn, isResponsable(planta), catchAsync(plantas.deletePlanta));


router.get('/:id/edit', isLoggedIn, isResponsable(planta), catchAsync(plantas.renderEditForm));


module.exports = router;