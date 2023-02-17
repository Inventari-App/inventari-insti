const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const proveidors = require('../controllers/proveidors');
const { isLoggedIn, isResponsable, validateProveidor } = require('../middlewareProveidors');
const Proveidor = require('../models/proveidor');

router.route('/')
.get(catchAsync(proveidors.index))
.post(isLoggedIn, validateProveidor, catchAsync(proveidors.createProveidor))

router.route('/all')
.get(catchAsync(proveidors.getProveidors))

router.get('/new', isLoggedIn, proveidors.renderNewForm);

router.route('/:id')
.get(catchAsync(proveidors.showProveidor))
.put(isLoggedIn, isResponsable, validateProveidor, catchAsync(proveidors.updateProveidor))
.delete(isLoggedIn, isResponsable, catchAsync(proveidors.deleteProveidor));


router.get('/:id/edit', isLoggedIn, isResponsable, catchAsync(proveidors.renderEditForm));


module.exports = router;