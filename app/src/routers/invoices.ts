import express, { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';
import * as invoices from '../controllers/invoices';
import { isLoggedIn, isResponsableOrAdmin, validateSchema, isInvoiceAprovada, isInvoiceRebuda } from '../middleware';
import { invoiceSchema } from '../schemas';
import Invoice from '../models/invoice';
import Department from '../models/department';

const router = express.Router();

const validateInvoice = validateSchema(invoiceSchema);
const isInvoiceResponsableOrAdmin = isResponsableOrAdmin(Invoice);

const checkUserHasDepartment = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.currentUser;
  const department = await Department.findById(user?.department);
  if (!department) {
    req.flash("error", "Usuari no vinculat a departament.");
    return res.redirect("/invoices");
  }
  next();
};

router.route('/')
  .get(catchAsync(invoices.index))
  .post(isLoggedIn, validateInvoice, catchAsync(invoices.createInvoice));

router.get('/new', isLoggedIn, checkUserHasDepartment, invoices.renderNewForm);

router.route('/:id')
  .get(isInvoiceAprovada, catchAsync(invoices.showInvoice))
  .put(isLoggedIn, isInvoiceResponsableOrAdmin, validateInvoice, catchAsync(invoices.updateInvoice))
  .delete(isLoggedIn, isInvoiceResponsableOrAdmin, catchAsync(invoices.deleteInvoice));

router.route('/:id/print')
  .get(isLoggedIn, isInvoiceResponsableOrAdmin, catchAsync(invoices.printInvoice));

router.get('/:id/edit', isLoggedIn, isInvoiceResponsableOrAdmin, catchAsync(invoices.renderEditForm));

router.route('/:id/status')
  .put(isLoggedIn, isInvoiceResponsableOrAdmin, validateInvoice, catchAsync(invoices.updateInvoiceStatus));

export default router;

