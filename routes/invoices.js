const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const invoices = require('../controllers/invoices');
const { isLoggedIn, isResponsable, validateInvoice } = require('../middlewareInvoices');
const Invoice = require('../models/invoice');

router.route('/')
.get(catchAsync(invoices.index))
.post(isLoggedIn, validateInvoice, catchAsync(invoices.createInvoice))

router.get('/new', isLoggedIn, invoices.renderNewForm);

router.route('/:id')
.get(catchAsync(invoices.showInvoice))
.put(isLoggedIn, isResponsable, validateInvoice, catchAsync(invoices.updateInvoice))
.delete(isLoggedIn, isResponsable, catchAsync(invoices.deleteInvoice));


router.get('/:id/edit', isLoggedIn, isResponsable, catchAsync(invoices.renderEditForm));


module.exports = router;