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
exports.validateRecaptcha = exports.handleError = exports.handleRouteError = exports.requireLogin = exports.isInvoiceRebuda = exports.isInvoiceAprovada = exports.isAdmin = exports.isResponsableOrAdmin = exports.isResponsable = exports.isSameUserOrAdmin = exports.isSameUser = exports.isLoggedIn = exports.validateSchema = void 0;
const user_ts_1 = __importDefault(require("../models/user.ts"));
const invoice_ts_1 = __importDefault(require("../models/invoice.ts"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const validateSchema = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        console.error(error);
        res.sendStatus(400);
    }
    else {
        next();
    }
};
exports.validateSchema = validateSchema;
const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //res.session.returnTo = req.originalUrl;
        req.flash("error", "Has d'estar connectat/da");
        return res.redirect("/login");
    }
    next();
};
exports.isLoggedIn = isLoggedIn;
const isSameUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield user_ts_1.default.findById(id);
    const reqUser = req.user;
    if (!user._id.equals(reqUser === null || reqUser === void 0 ? void 0 : reqUser._id)) {
        req.flash("error", "No tens permisos per fer això!");
        return res.redirect(`/invoices`);
    }
    next();
});
exports.isSameUser = isSameUser;
const isSameUserOrAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield user_ts_1.default.findById(id);
        if (user._id != (user === null || user === void 0 ? void 0 : user.userId) && !(user === null || user === void 0 ? void 0 : user.isAdmin)) {
            req.flash("error", "No tens permisos per fer això!");
            return res.redirect(`/invoices`);
        }
        next();
    }
    catch (_a) {
        req.flash("error", "Probablement l'usuari no existeix");
        res.redirect("/users");
    }
});
exports.isSameUserOrAdmin = isSameUserOrAdmin;
const isResponsable = (Model) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const reqUser = req.user;
    const model = yield Model.findById(id);
    if (!model.responsable.equals(reqUser === null || reqUser === void 0 ? void 0 : reqUser._id)) {
        req.flash("error", "No tens permisos per fer això!");
        return res.redirect(`/invoices`);
    }
    next();
});
exports.isResponsable = isResponsable;
const isResponsableOrAdmin = (Model) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const reqUser = req.user;
    const model = yield Model.findById(id);
    if (model.responsable._id != (reqUser === null || reqUser === void 0 ? void 0 : reqUser._id) && !(reqUser === null || reqUser === void 0 ? void 0 : reqUser.isAdmin)) {
        req.flash("error", "No tens permisos per fer això!");
        return res.redirect(`/invoices`);
    }
    next();
});
exports.isResponsableOrAdmin = isResponsableOrAdmin;
const isAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqUser = req.user;
        const user = yield user_ts_1.default.findById(reqUser.id);
        if (!user.isAdmin) {
            req.flash("error", "No tens permisos per fer això!");
            return res.redirect(`/invoices`);
        }
        next();
    }
    catch (_a) {
        req.flash("error", "Hi ha hagut un error.");
        return res.redirect(`/invoices`);
    }
});
exports.isAdmin = isAdmin;
const isInvoiceAprovada = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const invoice = yield invoice_ts_1.default.findById(id);
    const isRebuda = invoice.status === "rebuda";
    if (isRebuda) {
        req.flash("error", "Aquesta commanda esta rebuda.");
        return res.redirect(`/invoices`);
    }
    next();
});
exports.isInvoiceAprovada = isInvoiceAprovada;
const isInvoiceRebuda = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const invoice = yield invoice_ts_1.default.findById(id);
    const isRebuda = invoice.status === "rebuda";
    if (!isRebuda) {
        req.flash("error", "Aquesta commanda no esta rebuda.");
        return res.redirect(`/invoices`);
    }
    next();
});
exports.isInvoiceRebuda = isInvoiceRebuda;
const requireLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user) {
        return next();
    }
    else {
        req.flash("error", "Has d'estar logat per veure la pagina.");
        res.redirect("/login");
    }
});
exports.requireLogin = requireLogin;
const handleRouteError = (err, _req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { statusCode } = err;
    if (statusCode === 404) {
        res.status(statusCode).render("404");
    }
    else {
        next(err);
    }
});
exports.handleRouteError = handleRouteError;
const handleError = (err, _req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("error", { err });
    console.error(err);
    next(err);
});
exports.handleError = handleError;
const validateRecaptcha = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gRecaptchaResponse = req.body["g-recaptcha-response"];
        const secret = "6LcDV44pAAAAACxZIgn9aMiGmiovr9sWWfcceTFm";
        const params = new URLSearchParams();
        params.append("secret", secret);
        params.append("response", gRecaptchaResponse);
        const googleRes = yield (0, node_fetch_1.default)("https://www.google.com/recaptcha/api/siteverify", {
            method: "POST",
            body: params,
        });
        const googleResJson = yield googleRes.json();
        if (googleResJson.success) {
            next();
        }
        else {
            throw new Error();
        }
    }
    catch (_a) {
        req.flash("error", "Alguna cosa ha anat malament...");
        res.redirect(req.body.redirect);
    }
});
exports.validateRecaptcha = validateRecaptcha;
//# sourceMappingURL=index.js.map