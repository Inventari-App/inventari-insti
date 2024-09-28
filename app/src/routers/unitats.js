const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const unitats = require('../controllers/unitats');
const { isLoggedIn, isResponsableOrAdmin, validateSchema } = require('../middleware');
const { unitatSchema } = require('../schemas');
const unitat = require('../models/unitat');

const validateUnitat = validateSchema(unitatSchema)

router.route('/')
.get(catchAsync(unitats.index))
.post(isLoggedIn, validateUnitat, catchAsync(unitats.createUnitat))

router.route('/all')
.get(catchAsync(unitats.getUnitats))

router.get('/new', isLoggedIn, unitats.renderNewForm);

router.route('/:id')
.get(catchAsync(unitats.showUnitat))
.put(isLoggedIn, isResponsableOrAdmin(unitat), validateUnitat, catchAsync(unitats.updateUnitat))
.delete(isLoggedIn, isResponsableOrAdmin(unitat), catchAsync(unitats.deleteUnitat));


router.get('/:id/edit', isLoggedIn, isResponsableOrAdmin(unitat), catchAsync(unitats.renderEditForm));


module.exports = router;