import express from 'express';
import catchAsync from '../utils/catchAsync';
import * as unitats from '../controllers/unitats';
import { isLoggedIn, isResponsableOrAdmin, validateSchema } from '../middleware';
import { unitatSchema } from '../schemas';
import unitat from '../models/unitat';

const router = express.Router();

const validateUnitat = validateSchema(unitatSchema);

router.route('/')
  .get(catchAsync(unitats.index))
  .post(isLoggedIn, validateUnitat, catchAsync(unitats.createUnitat));

router.route('/all')
  .get(catchAsync(unitats.getUnitats));

router.get('/new', isLoggedIn, unitats.renderNewForm);

router.route('/:id')
  .get(catchAsync(unitats.showUnitat))
  .put(isLoggedIn, isResponsableOrAdmin(unitat), validateUnitat, catchAsync(unitats.updateUnitat))
  .delete(isLoggedIn, isResponsableOrAdmin(unitat), catchAsync(unitats.deleteUnitat));

router.get('/:id/edit', isLoggedIn, isResponsableOrAdmin(unitat), catchAsync(unitats.renderEditForm));

export default router;

