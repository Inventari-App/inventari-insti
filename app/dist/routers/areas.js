import express from 'express';
import catchAsync from '../utils/catchAsync';
import * as areas from '../controllers/areas';
import { isLoggedIn, isResponsable, validateSchema } from '../middleware';
import { areaSchema } from '../schemas';
import area from '../models/area';
const router = express.Router();
const validateArea = validateSchema(areaSchema);
router.route('/')
    .get(catchAsync(areas.index))
    .post(isLoggedIn, validateArea, catchAsync(areas.createArea));
router.route('/all')
    .get(catchAsync(areas.getAreas));
router.get('/new', isLoggedIn, areas.renderNewForm);
router.route('/:id')
    .get(catchAsync(areas.showArea))
    .put(isLoggedIn, isResponsable(area), validateArea, catchAsync(areas.updateArea))
    .delete(isLoggedIn, isResponsable(area), catchAsync(areas.deleteArea));
router.get('/:id/edit', isLoggedIn, isResponsable(area), catchAsync(areas.renderEditForm));
export default router;
