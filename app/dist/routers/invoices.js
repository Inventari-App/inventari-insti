var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import catchAsync from '../utils/catchAsync';
import * as invoices from '../controllers/invoices';
import { isLoggedIn, isResponsableOrAdmin, validateSchema, isInvoiceAprovada } from '../middleware';
import { invoiceSchema } from '../schemas';
import Invoice from '../models/invoice';
import Department from '../models/department';
const router = express.Router();
const validateInvoice = validateSchema(invoiceSchema);
const isInvoiceResponsableOrAdmin = isResponsableOrAdmin(Invoice);
const checkUserHasDepartment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const department = yield Department.findById(user === null || user === void 0 ? void 0 : user.department);
    if (!department) {
        req.flash("error", "Usuari no vinculat a departament.");
        return res.redirect("/invoices");
    }
    next();
});
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
