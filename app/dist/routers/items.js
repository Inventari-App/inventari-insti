import express from 'express';
import catchAsync from '../utils/catchAsync';
import * as items from '../controllers/items';
import { isLoggedIn, isResponsableOrAdmin, validateSchema } from '../middleware';
import { itemSchema } from '../schemas';
import item from '../models/item';
const router = express.Router();
const validateItem = validateSchema(itemSchema);
router.route('/')
    .get(catchAsync(items.index))
    .post(isLoggedIn, validateItem, catchAsync(items.createItem));
router.route('/all')
    .get(catchAsync(items.getItems));
router.get('/new', isLoggedIn, items.renderNewForm);
router.route('/:id')
    .get(catchAsync(items.showItem))
    .put(isLoggedIn, isResponsableOrAdmin(item), validateItem, catchAsync(items.updateItem))
    .delete(isLoggedIn, isResponsableOrAdmin(item), catchAsync(items.deleteItem));
router.get('/:id/edit', isLoggedIn, isResponsableOrAdmin(item), catchAsync(items.renderEditForm));
export default router;
