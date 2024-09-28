import express from 'express';
import catchAsync from '../utils/catchAsync';
import * as centre from '../controllers/centre';

const router = express.Router();

router.route('/')
  .get(catchAsync(centre.index));

export default router;

