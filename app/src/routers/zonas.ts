import express from 'express';
import catchAsync from '../utils/catchAsync';
import * as zonas from '../controllers/zonas';
import { isLoggedIn, isResponsable, validateSchema } from '../middleware';
import { zonaSchema } from '../schemas';
import zona from '../models/zona';

const router = express.Router();

const validateZona = validateSchema(zonaSchema);

router.route('/')
  .get(catchAsync(zonas.index))
  .post(isLoggedIn, validateZona, catchAsync(zonas.createZona));

router.route('/all')
  .get(catchAsync(zonas.getZonas));

router.get('/new', isLoggedIn, zonas.renderNewForm);

router.route('/:id')
  .get(catchAsync(zonas.showZona))
  .put(isLoggedIn, isResponsable(zona), validateZona, catchAsync(zonas.updateZona))
  .delete(isLoggedIn, isResponsable(zona), catchAsync(zonas.deleteZona));

router.get('/:id/edit', isLoggedIn, isResponsable(zona), catchAsync(zonas.renderEditForm));

export default router;

