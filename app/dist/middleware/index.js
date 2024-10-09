var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import User from "../models/user";
import Invoice from "../models/invoice";
import fetch from "node-fetch";
export const validateSchema = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        console.error(error);
        res.sendStatus(400);
    }
    else {
        next();
    }
};
export const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //res.session.returnTo = req.originalUrl;
        req.flash("error", "Has d'estar connectat/da");
        return res.redirect("/login");
    }
    next();
};
export const isSameUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const user = yield User.findById(id);
    if (!user._id.equals((_a = req.user) === null || _a === void 0 ? void 0 : _a._id)) {
        req.flash("error", "No tens permisos per fer això!");
        return res.redirect(`/invoices`);
    }
    next();
});
export const isSameUserOrAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield User.findById(id);
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
export const isResponsable = (Model) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const model = yield Model.findById(id);
    if (!model.responsable.equals((_a = req.user) === null || _a === void 0 ? void 0 : _a._id)) {
        req.flash("error", "No tens permisos per fer això!");
        return res.redirect(`/invoices`);
    }
    next();
});
export const isResponsableOrAdmin = (Model) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { user } = req;
    const model = yield Model.findById(id);
    if (model.responsable._id != (user === null || user === void 0 ? void 0 : user.id) && !(user === null || user === void 0 ? void 0 : user.isAdmin)) {
        req.flash("error", "No tens permisos per fer això!");
        return res.redirect(`/invoices`);
    }
    next();
});
export const isAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield User.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        if (!user.isAdmin) {
            req.flash("error", "No tens permisos per fer això!");
            return res.redirect(`/invoices`);
        }
        next();
    }
    catch (_b) {
        req.flash("error", "Hi ha hagut un error.");
        return res.redirect(`/invoices`);
    }
});
export const isInvoiceAprovada = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const invoice = yield Invoice.findById(id);
    const isRebuda = invoice.status === "rebuda";
    if (isRebuda) {
        req.flash("error", "Aquesta commanda esta rebuda.");
        return res.redirect(`/invoices`);
    }
    next();
});
export const isInvoiceRebuda = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const invoice = yield Invoice.findById(id);
    const isRebuda = invoice.status === "rebuda";
    if (!isRebuda) {
        req.flash("error", "Aquesta commanda no esta rebuda.");
        return res.redirect(`/invoices`);
    }
    next();
});
export const requireLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user) {
        return next();
    }
    else {
        req.flash("error", "Has d'estar logat per veure la pagina.");
        res.redirect("/login");
    }
});
export const handleRouteError = (err, _req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { statusCode } = err;
    if (statusCode === 404) {
        res.status(statusCode).render("404");
    }
    else {
        next(err);
    }
});
export const handleError = (err, _req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("error", { err });
    console.error(err);
    next(err);
});
export const validateRecaptcha = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gRecaptchaResponse = req.body["g-recaptcha-response"];
        const secret = "6LcDV44pAAAAACxZIgn9aMiGmiovr9sWWfcceTFm";
        const params = new URLSearchParams();
        params.append("secret", secret);
        params.append("response", gRecaptchaResponse);
        const googleRes = yield fetch("https://www.google.com/recaptcha/api/siteverify", {
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
