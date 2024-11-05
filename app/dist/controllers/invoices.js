"use strict";
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
exports.deleteInvoice = exports.updateInvoice = exports.updateInvoiceStatus = exports.renderEditForm = exports.printInvoice = exports.showInvoice = exports.createInvoice = exports.renderNewForm = exports.index = void 0;
const invoice_1 = __importDefault(require("../models/invoice"));
const item_1 = __importDefault(require("../models/item"));
const autocompleter_1 = __importDefault(require("autocompleter"));
const sendEmail_1 = require("../nodemailer/sendEmail");
const helpers_1 = require("../utils/helpers");
const department_1 = __importDefault(require("../models/department"));
const center_1 = __importDefault(require("../models/center"));
const user_1 = __importDefault(require("@/models/user"));
const protocol = (0, helpers_1.getProtocol)();
const index = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req;
        const { status } = req.query;
        // Filter by invoice status if provided
        const filter = {};
        if (status &&
            ["pendent", "aprovada", "rebuda"].includes(status)) {
            filter.status = status;
        }
        // Show only user/admin invoices based on filter
        const invoices = yield invoice_1.default.find(!(user === null || user === void 0 ? void 0 : user.isAdmin)
            ? Object.assign(Object.assign({}, filter), { responsable: { _id: user === null || user === void 0 ? void 0 : user.userId } }) : filter)
            .populate("responsable")
            .sort({ createdAt: -1 });
        res.render("invoices/index", { invoices });
    }
    catch (err) {
        next(err);
    }
});
exports.index = index;
const renderNewForm = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("invoices/new", {
        autocomplete: autocompleter_1.default,
    });
});
exports.renderNewForm = renderNewForm;
const createInvoice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { invoiceItems, comment } = req.body;
        if (!invoiceItems.length) {
            res.status(400).send("Bad request");
        }
        const { user } = req;
        const department = yield department_1.default.findById(user === null || user === void 0 ? void 0 : user.department);
        const invoice = new invoice_1.default({
            responsable: user === null || user === void 0 ? void 0 : user.responsableId,
            invoiceItems,
            comment,
            department: department.nom,
        });
        yield invoice.save();
        yield emailCreated(invoice, user.email, req.headers.host);
        req.flash("success", "Comanda creada correctament!");
        res.json(invoice);
    }
    catch (err) {
        next(err);
    }
});
exports.createInvoice = createInvoice;
const showInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const invoice = yield invoice_1.default.findById(req.params.id)
        .populate("responsable")
        .populate({
        path: "responsable",
        populate: { path: "department" }, // Complete path for nested population
    })
        .lean();
    if (!invoice) {
        req.flash("error", "No es pot trobar l'invoice!");
        return res.redirect("/invoices");
    }
    const items = yield item_1.default.find({
        nom: {
            $in: invoice.invoiceItems.map((item) => item.article),
        },
    });
    res.render(invoice.status === "aprovada" ? "invoices/receive" : "invoices/show", {
        invoice,
        items,
        invoiceJSON: JSON.stringify(invoice),
        isResponsable: invoice.responsable._id.equals((_a = req.currentUser) === null || _a === void 0 ? void 0 : _a.id),
        localizeBoolean: helpers_1.localizeBoolean,
    });
});
exports.showInvoice = showInvoice;
const printInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const invoice = yield invoice_1.default.findById(req.params.id)
        .populate("responsable")
        .populate({
        path: "responsable",
        populate: { path: "department" }, // Complete path for nested population
    })
        .lean();
    if (!invoice) {
        req.flash("error", "No es pot trobar l'invoice!");
        return res.redirect("/invoices");
    }
    const items = yield item_1.default.find({
        nom: {
            $in: invoice.invoiceItems.map((item) => item.article),
        },
    });
    const center = yield center_1.default.findById(invoice.center);
    res.render("invoices/print", {
        invoice,
        items,
        center,
        invoiceJSON: JSON.stringify(invoice),
        isResponsable: invoice.responsable._id.equals((_a = req.currentUser) === null || _a === void 0 ? void 0 : _a.id),
        twoDecimals: helpers_1.twoDecimals,
    });
});
exports.printInvoice = printInvoice;
const renderEditForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const invoice = yield invoice_1.default.findById(req.params.id).populate("responsable");
    if (!invoice) {
        req.flash("error", "No es pot trobar l'invoice!");
        return res.redirect("/invoices");
    }
    res.render("invoices/edit", { invoice, autocomplete: autocompleter_1.default });
});
exports.renderEditForm = renderEditForm;
const updateInvoiceStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const invoice = yield invoice_1.default.findByIdAndUpdate(id, { status }, { new: true }).populate("responsable");
        if (status === "rebuda" && req.headers.host)
            yield emailReceived(invoice, req.headers.host);
        if (status !== "rebuda" && req.headers.host)
            yield emailStatusChange(invoice, status, req.headers.host);
        res.redirect("/invoices");
    }
    catch (error) {
        console.error(error);
    }
});
exports.updateInvoiceStatus = updateInvoiceStatus;
const updateInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { redirect } = req.query;
        const { user } = req;
        const invoice = yield invoice_1.default.findByIdAndUpdate(id, Object.assign({}, req.body), { new: true }).populate("responsable");
        if (req.currentUser && req.headers.host) {
            yield emailModified({ invoice, user: req.currentUser, host: req.headers.host });
        }
        req.flash("success", "Comanda actualitzada correctament!");
        if (redirect)
            return (user === null || user === void 0 ? void 0 : user.isAdmin)
                ? res.redirect(`/invoices`)
                : res.redirect(`/invoices/${id}`);
        return res.status(201).json(invoice.toJSON());
    }
    catch (error) {
        console.error(error);
    }
});
exports.updateInvoice = updateInvoice;
const deleteInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield invoice_1.default.findByIdAndDelete(id);
    req.flash("success", "Comanda eliminada correctament!");
    res.redirect("/invoices");
});
exports.deleteInvoice = deleteInvoice;
function getAdminEmails() {
    return __awaiter(this, void 0, void 0, function* () {
        const admins = yield user_1.default.find({ isAdmin: true }).exec();
        const adminEmails = admins.length && admins.map((admin) => admin.email).join("; ");
        return adminEmails;
    });
}
function emailCreated(invoice, email, host) {
    return __awaiter(this, void 0, void 0, function* () {
        const adminEmails = yield getAdminEmails();
        if (!adminEmails)
            return console.error("No admin emails?");
        const { message, sendEmail } = (0, sendEmail_1.useNodemailer)({
            to: adminEmails,
            model: "invoice",
            reason: "created",
        });
        return (sendEmail &&
            sendEmail({
                subject: message.subject.replace(/{{user}}/, email),
                text: message.text.replace(/{{url}}/, `${protocol}://${host}/invoices/${invoice._id}`),
            }));
    });
}
function emailModified(_a) {
    return __awaiter(this, arguments, void 0, function* ({ invoice, user, host, }) {
        const adminEmails = yield getAdminEmails();
        if (!adminEmails)
            return console.error("No admin emails?");
        const responsableEmail = invoice.responsable.email;
        // 1. User === responsable => email admin
        // 2. User !== responsable => email responsable
        // 3. User === responsable && isAdmin => email admin??
        const responsableIsEditing = user.email === responsableEmail;
        // const adminIsEditing = user.isAdmin
        const { message, sendEmail } = (0, sendEmail_1.useNodemailer)({
            to: responsableIsEditing ? adminEmails : responsableEmail,
            model: "invoice",
            reason: "modified",
        });
        return (sendEmail &&
            sendEmail({
                subject: message.subject,
                text: message.text
                    .replace(/{{user}}/, invoice.responsable.email)
                    .replace(/{{url}}/, `${protocol}://${host}/invoices/${invoice._id}`),
            }));
    });
}
function emailStatusChange(invoice, status, host) {
    return __awaiter(this, void 0, void 0, function* () {
        const adminEmails = yield getAdminEmails();
        if (!adminEmails)
            return console.error("No admin emails?");
        const responsableEmail = invoice.responsable.email;
        const { message, sendEmail } = (0, sendEmail_1.useNodemailer)({
            to: /aprovada|pendent/.test(status) ? responsableEmail : adminEmails,
            model: "invoice",
            reason: "status",
        });
        return message && sendEmail({
            subject: message.subject.replace(/{{status}}/, status),
            text: message.text
                .replace(/{{user}}/, invoice.responsable.email)
                .replace(/{{status}}/, status)
                .replace(/{{url}}/, `${protocol}://${host}/invoices/${invoice._id}`),
        });
    });
}
function emailReceived(invoice, host) {
    return __awaiter(this, void 0, void 0, function* () {
        const adminEmails = yield getAdminEmails();
        if (!adminEmails)
            return console.error("No admin emails?");
        const responsableEmail = invoice.responsable.email;
        const { message, sendEmail } = (0, sendEmail_1.useNodemailer)({
            to: adminEmails,
            model: "invoice",
            reason: "received",
        });
        return message && sendEmail({
            subject: message.subject,
            text: message.text
                .replace(/{{user}}/, responsableEmail)
                .replace(/{{url}}/, `${protocol}://${host}/invoices`),
        });
    });
}
//# sourceMappingURL=invoices.js.map