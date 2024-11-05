"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const invoices = __importStar(require("../controllers/invoices"));
const middleware_1 = require("../middleware");
const schemas_1 = require("../schemas");
const invoice_1 = __importDefault(require("../models/invoice"));
const department_1 = __importDefault(require("../models/department"));
const router = express_1.default.Router();
const validateInvoice = (0, middleware_1.validateSchema)(schemas_1.invoiceSchema);
const isInvoiceResponsableOrAdmin = (0, middleware_1.isResponsableOrAdmin)(invoice_1.default);
const checkUserHasDepartment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.currentUser;
    const department = yield department_1.default.findById(user === null || user === void 0 ? void 0 : user.department);
    if (!department) {
        req.flash("error", "Usuari no vinculat a departament.");
        return res.redirect("/invoices");
    }
    next();
});
router.route('/')
    .get((0, catchAsync_1.default)(invoices.index))
    .post(middleware_1.isLoggedIn, validateInvoice, (0, catchAsync_1.default)(invoices.createInvoice));
router.get('/new', middleware_1.isLoggedIn, checkUserHasDepartment, invoices.renderNewForm);
router.route('/:id')
    .get(middleware_1.isInvoiceAprovada, (0, catchAsync_1.default)(invoices.showInvoice))
    .put(middleware_1.isLoggedIn, isInvoiceResponsableOrAdmin, validateInvoice, (0, catchAsync_1.default)(invoices.updateInvoice))
    .delete(middleware_1.isLoggedIn, isInvoiceResponsableOrAdmin, (0, catchAsync_1.default)(invoices.deleteInvoice));
router.route('/:id/print')
    .get(middleware_1.isLoggedIn, isInvoiceResponsableOrAdmin, (0, catchAsync_1.default)(invoices.printInvoice));
router.get('/:id/edit', middleware_1.isLoggedIn, isInvoiceResponsableOrAdmin, (0, catchAsync_1.default)(invoices.renderEditForm));
router.route('/:id/status')
    .put(middleware_1.isLoggedIn, isInvoiceResponsableOrAdmin, validateInvoice, (0, catchAsync_1.default)(invoices.updateInvoiceStatus));
exports.default = router;
//# sourceMappingURL=invoices.js.map