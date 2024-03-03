const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const invoices = require('../controllers/invoices');
const { isLoggedIn, isResponsableOrAdmin, validateSchema, isInvoiceAprovada, isInvoiceRebuda } = require('../middleware');
const { invoiceSchema } = require('../schemas');
const Invoice = require('../models/invoice');
const Department = require('../models/department');

const validateInvoice = validateSchema(invoiceSchema)
const isInvoiceResponsableOrAdmin = isResponsableOrAdmin(Invoice)

const checkUserHasDepartment = async (req, res, next) => {
  const user = req.user
  const department = await Department.findById(user.department)
  if (!department) {
    req.flash("error", "Usuari no vinculat a departament.");
    return res.redirect("/invoices");
  }
  next()
}

router.route('/')
  .get(catchAsync(invoices.index))
  .post(isLoggedIn, validateInvoice, catchAsync(invoices.createInvoice))

router.get('/new', isLoggedIn, checkUserHasDepartment, invoices.renderNewForm);

router.route('/:id')
  .get(isInvoiceAprovada, catchAsync(invoices.showInvoice))
  .put(isLoggedIn, isInvoiceResponsableOrAdmin, validateInvoice, catchAsync(invoices.updateInvoice))
  .delete(isLoggedIn, isInvoiceResponsableOrAdmin, catchAsync(invoices.deleteInvoice));

router.route('/:id/print')
  .get(isLoggedIn, isInvoiceRebuda, isInvoiceResponsableOrAdmin, catchAsync(invoices.printInvoice))

router.get('/:id/edit', isLoggedIn, isInvoiceResponsableOrAdmin, catchAsync(invoices.renderEditForm));

router.route('/:id/status')
  .put(isLoggedIn, isInvoiceResponsableOrAdmin, validateInvoice, catchAsync(invoices.updateInvoiceStatus))

module.exports = router;
