const express = require('express');
const router = express.Router();
const catchAsync = require('../../utils/catchAsync');
const invoices = require('../../controllers/invoices');
const { isLoggedIn, isResponsableOrAdmin, validateSchema, isInvoiceAprovada } = require('../../middleware');
const { invoiceSchema } = require('../../schemas');
const Invoice = require('../../models/invoice');

const validateInvoice = validateSchema(invoiceSchema)
const isInvoiceResponsableOrAdmin = isResponsableOrAdmin(Invoice)

router.route('/')
.get(catchAsync(invoices.index))
.post(isLoggedIn, validateInvoice, catchAsync(invoices.createInvoice))

router.get('/new', isLoggedIn, invoices.renderNewForm);

router.route('/:id')
.get(isInvoiceAprovada, catchAsync(invoices.showInvoice))
.put(isLoggedIn, isInvoiceResponsableOrAdmin, validateInvoice, catchAsync(invoices.updateInvoice))
.delete(isLoggedIn, isInvoiceResponsableOrAdmin, catchAsync(invoices.deleteInvoice));

router.get('/:id/edit', isLoggedIn, isInvoiceResponsableOrAdmin, catchAsync(invoices.renderEditForm));

router.route('/:id/status')
.put(isLoggedIn, isInvoiceResponsableOrAdmin, validateInvoice, catchAsync(invoices.updateInvoiceStatus))

module.exports = router;