const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const zonas = require('../controllers/zonas');
const { isLoggedIn, isResponsable, validateZona } = require('../middlewareZonas');
const Zona = require('../models/zona');

router.route('/')
.get(catchAsync(zonas.index))
.post(isLoggedIn, validateZona, catchAsync(zonas.createZona))

router.route('/all')
.get(catchAsync(zonas.getZonas))

router.get('/new', isLoggedIn, zonas.renderNewForm);

router.route('/:id')
.get(catchAsync(zonas.showZona))
.put(isLoggedIn, isResponsable, validateZona, catchAsync(zonas.updateZona))
.delete(isLoggedIn, isResponsable, catchAsync(zonas.deleteZona));


router.get('/:id/edit', isLoggedIn, isResponsable, catchAsync(zonas.renderEditForm));


module.exports = router;