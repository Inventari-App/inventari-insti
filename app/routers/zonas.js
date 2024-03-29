const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const zonas = require('../controllers/zonas');
const { isLoggedIn, isResponsable, validateSchema } = require('../middleware');
const { zonaSchema } = require('../schemas');
const zona = require('../models/zona');

const validateZona = validateSchema(zonaSchema)

router.route('/')
.get(catchAsync(zonas.index))
.post(isLoggedIn, validateZona, catchAsync(zonas.createZona))

router.route('/all')
.get(catchAsync(zonas.getZonas))

router.get('/new', isLoggedIn, zonas.renderNewForm);

router.route('/:id')
.get(catchAsync(zonas.showZona))
.put(isLoggedIn, isResponsable(zona), validateZona, catchAsync(zonas.updateZona))
.delete(isLoggedIn, isResponsable(zona), catchAsync(zonas.deleteZona));


router.get('/:id/edit', isLoggedIn, isResponsable(zona), catchAsync(zonas.renderEditForm));


module.exports = router;