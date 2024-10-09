import express from 'express';
import catchAsync from '../utils/catchAsync';
import * as proveidors from '../controllers/proveidors';
import { isLoggedIn, isResponsableOrAdmin, validateSchema } from '../middleware';
import { proveidorSchema } from '../schemas';
import proveidor from '../models/proveidor';
const router = express.Router();
const validateProveidor = validateSchema(proveidorSchema);
router.route('/')
    .get(catchAsync(proveidors.index))
    .post(isLoggedIn, validateProveidor, catchAsync(proveidors.createProveidor));
router.route('/all')
    .get(catchAsync(proveidors.getProveidors));
router.get('/new', isLoggedIn, proveidors.renderNewForm);
router.route('/:id')
    .get(catchAsync(proveidors.showProveidor))
    .put(isLoggedIn, isResponsableOrAdmin(proveidor), validateProveidor, catchAsync(proveidors.updateProveidor))
    .delete(isLoggedIn, isResponsableOrAdmin(proveidor), catchAsync(proveidors.deleteProveidor));
router.get('/:id/edit', isLoggedIn, isResponsableOrAdmin(proveidor), catchAsync(proveidors.renderEditForm));
export default router;
