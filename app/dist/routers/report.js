import express from 'express';
import catchAsync from '../utils/catchAsync';
import * as report from '../controllers/reports';
const router = express.Router();
router.route('/')
    .get(catchAsync(report.index));
router.route('/show')
    .get(catchAsync(report.show));
export default router;
