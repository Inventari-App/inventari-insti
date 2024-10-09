import express from 'express';
import catchAsync from '../utils/catchAsync';
import * as departments from '../controllers/departments';
import { isLoggedIn, validateSchema, isAdmin } from '../middleware';
import { departmentSchema } from '../schemas';
const router = express.Router();
const validateDepartment = validateSchema(departmentSchema);
router.route('/')
    .get(catchAsync(departments.index))
    .post(isLoggedIn, validateDepartment, catchAsync(departments.createDepartment));
router.route('/all')
    .get(catchAsync(departments.getDepartments));
router.get('/new', isLoggedIn, departments.renderNewForm);
router.route('/:id')
    .get(catchAsync(departments.showDepartment))
    .put(isLoggedIn, isAdmin, validateDepartment, catchAsync(departments.updateDepartment))
    .delete(isLoggedIn, isAdmin, catchAsync(departments.deleteDepartment));
router.get('/:id/edit', isLoggedIn, isAdmin, catchAsync(departments.renderEditForm));
export default router;
