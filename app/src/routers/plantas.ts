import express from 'express';
import catchAsync from '../utils/catchAsync';
import * as plantas from '../controllers/plantas';
import { isLoggedIn, isResponsable, validateSchema } from '../middleware';
import { plantaSchema } from '../schemas';
import planta from '../models/planta';

const router = express.Router();

const validatePlanta = validateSchema(plantaSchema);

router.route('/')
  .get(catchAsync(plantas.index))
  .post(isLoggedIn, validatePlanta, catchAsync(plantas.createPlanta));

router.route('/all')
  .get(catchAsync(plantas.getPlantas));

router.get('/new', isLoggedIn, plantas.renderNewForm);

router.route('/:id')
  .get(catchAsync(plantas.showPlanta))
  .put(isLoggedIn, isResponsable(planta), validatePlanta, catchAsync(plantas.updatePlanta))
  .delete(isLoggedIn, isResponsable(planta), catchAsync(plantas.deletePlanta));

router.get('/:id/edit', isLoggedIn, isResponsable(planta), catchAsync(plantas.renderEditForm));

export default router;

