const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const departments = require('../controllers/departments');
const { isLoggedIn, validateSchema, isAdmin } = require('../middleware');
const { departmentSchema } = require('../schemas');
const validateDepartment = validateSchema(departmentSchema)

router.route('/')
.get(catchAsync(departments.index))
.post(isLoggedIn, validateDepartment, catchAsync(departments.createDepartment))

router.route('/all')
.get(catchAsync(departments.getDepartments))

router.get('/new', isLoggedIn, departments.renderNewForm);

router.route('/:id')
.get(catchAsync(departments.showDepartment))
.put(isLoggedIn, isAdmin, validateDepartment, catchAsync(departments.updateDepartment))
.delete(isLoggedIn, isAdmin, catchAsync(departments.deleteDepartment));


router.get('/:id/edit', isLoggedIn, isAdmin, catchAsync(departments.renderEditForm));


module.exports = router;