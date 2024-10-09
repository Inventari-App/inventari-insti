import express from 'express';
import catchAsync from '../utils/catchAsync';
import * as utilitats from '../controllers/utilitats';
import { isLoggedIn, isResponsable, validateSchema } from '../middleware';
import { unitatSchema } from '../schemas';
import utilitat from '../models/utilitat';
const router = express.Router();
const validateUtilitat = validateSchema(unitatSchema);
router.route('/')
    .get(catchAsync(utilitats.index))
    .post(isLoggedIn, validateUtilitat, catchAsync(utilitats.createUtilitat));
router.get('/new', isLoggedIn, utilitats.renderNewForm);
router.route('/:id')
    .get(catchAsync(utilitats.showUtilitat))
    .put(isLoggedIn, isResponsable(utilitat), validateUtilitat, catchAsync(utilitats.updateUtilitat))
    .delete(isLoggedIn, isResponsable(utilitat), catchAsync(utilitats.deleteUtilitat));
router.get('/:id/edit', isLoggedIn, isResponsable(utilitat), catchAsync(utilitats.renderEditForm));
export default router;
