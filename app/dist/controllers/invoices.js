var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Invoice from "../models/invoice";
import Item from "../models/item";
import autocomplete from "autocompleter";
import { useNodemailer } from "../nodemailer/sendEmail";
import { getProtocol, localizeBoolean, twoDecimals } from "../utils/helpers";
import Department from "../models/department";
import Center from "../models/center";
import User from "@/models/user";
const protocol = getProtocol();
export const index = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const invoices = yield Invoice.find(!(user === null || user === void 0 ? void 0 : user.isAdmin)
            ? Object.assign(Object.assign({}, filter), { responsable: { _id: user === null || user === void 0 ? void 0 : user.userId } }) : filter)
            .populate("responsable")
            .sort({ createdAt: -1 });
        res.render("invoices/index", { invoices });
    }
    catch (err) {
        next(err);
    }
});
export const renderNewForm = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("invoices/new", {
        autocomplete,
    });
});
export const createInvoice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { invoiceItems, comment } = req.body;
        if (!invoiceItems.length) {
            res.status(400).send("Bad request");
        }
        const { user } = req;
        const department = yield Department.findById(user === null || user === void 0 ? void 0 : user.department);
        const invoice = new Invoice({
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
export const showInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const invoice = yield Invoice.findById(req.params.id)
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
    const items = yield Item.find({
        nom: {
            $in: invoice.invoiceItems.map((item) => item.article),
        },
    });
    res.render(invoice.status === "aprovada" ? "invoices/receive" : "invoices/show", {
        invoice,
        items,
        invoiceJSON: JSON.stringify(invoice),
        isResponsable: invoice.responsable._id.equals((_a = req.user) === null || _a === void 0 ? void 0 : _a.id),
        localizeBoolean,
    });
});
export const printInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const invoice = yield Invoice.findById(req.params.id)
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
    const items = yield Item.find({
        nom: {
            $in: invoice.invoiceItems.map((item) => item.article),
        },
    });
    const center = yield Center.findById(invoice.center);
    res.render("invoices/print", {
        invoice,
        items,
        center,
        invoiceJSON: JSON.stringify(invoice),
        isResponsable: invoice.responsable._id.equals((_a = req.user) === null || _a === void 0 ? void 0 : _a.id),
        twoDecimals,
    });
});
export const renderEditForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const invoice = yield Invoice.findById(req.params.id).populate("responsable");
    if (!invoice) {
        req.flash("error", "No es pot trobar l'invoice!");
        return res.redirect("/invoices");
    }
    res.render("invoices/edit", { invoice, autocomplete });
});
export const updateInvoiceStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const invoice = yield Invoice.findByIdAndUpdate(id, { status }, { new: true }).populate("responsable");
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
export const updateInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { redirect } = req.query;
        const { user } = req;
        const invoice = yield Invoice.findByIdAndUpdate(id, Object.assign({}, req.body), { new: true }).populate("responsable");
        if (req.user && req.headers.host) {
            yield emailModified({ invoice, user: req.user, host: req.headers.host });
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
export const deleteInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield Invoice.findByIdAndDelete(id);
    req.flash("success", "Comanda eliminada correctament!");
    res.redirect("/invoices");
});
function getAdminEmails() {
    return __awaiter(this, void 0, void 0, function* () {
        const admins = yield User.find({ isAdmin: true }).exec();
        const adminEmails = admins.length && admins.map((admin) => admin.email).join("; ");
        return adminEmails;
    });
}
function emailCreated(invoice, email, host) {
    return __awaiter(this, void 0, void 0, function* () {
        const adminEmails = yield getAdminEmails();
        if (!adminEmails)
            return console.error("No admin emails?");
        const { message, sendEmail } = useNodemailer({
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
        const { message, sendEmail } = useNodemailer({
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
        const { message, sendEmail } = useNodemailer({
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
        const { message, sendEmail } = useNodemailer({
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
