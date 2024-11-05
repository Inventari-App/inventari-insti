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
exports.getAllUsers = getAllUsers;
exports.getUser = getUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.verifyUser = verifyUser;
exports.createUser = createUser;
exports.createCenter = createCenter;
exports.sendPasswordReset = sendPasswordReset;
const user_1 = __importDefault(require("../models/user"));
const center_1 = __importDefault(require("../models/center"));
const random_hash_1 = require("random-hash");
const helpers_1 = require("../utils/helpers");
const sendEmail_1 = require("../nodemailer/sendEmail");
const helpers_2 = require("../utils/helpers");
const protocol = (0, helpers_2.getProtocol)();
function createCenter(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { center: centerName, name, surname, email, password } = req.body;
            const center = yield new center_1.default({ name: centerName }).save();
            const user = new user_1.default({
                email,
                username: email,
                name,
                surname,
                center: center._id,
                isAdmin: true,
                verificationTs: (0, helpers_1.getExpirationTs)(24 * 60 * 60 * 1000), // 1 day in ms
                verificationHash: (0, random_hash_1.generateHash)({ length: 8 }),
            });
            center.users.push(user._id);
            center.save();
            yield user_1.default.register(user, password);
            const { sendEmail, message } = (0, sendEmail_1.useNodemailer)({
                to: user.email,
                model: "user",
                reason: "verify",
            });
            if (sendEmail)
                yield sendEmail({
                    subject: message.subject,
                    text: message.text.replace(/{{url}}/, `${protocol}://${req.headers.host}/verify?userId=${user.id}&token=${user.verificationHash}`),
                });
            req.flash("info", "Tens 24 hores per activar el teu usuari fent click al link que t'hem enviat per correu.");
            res.redirect("/login");
        }
        catch (e) {
            if (e instanceof Error) {
                req.flash("error", e.message);
            }
            else {
                req.flash("error", "An unknown error occurred.");
            }
            res.redirect("register");
            next(e);
        }
    });
}
function createUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password, centerId } = req.body;
            const user = new user_1.default(Object.assign(Object.assign({}, req.body), { username: email, center: centerId, verificationTs: (0, helpers_1.getExpirationTs)(), verificationHash: (0, random_hash_1.generateHash)({ length: 8 }) }));
            if (!user) {
                throw new Error("Alguna cosa ha sortit malament al crear l'usuari");
            }
            const center = yield center_1.default.findById(centerId);
            center.users.push(user._id);
            // User is saved here
            yield user_1.default.register(user, password);
            const { sendEmail, message } = (0, sendEmail_1.useNodemailer)({
                to: user.email,
                model: "user",
                reason: "verify",
            });
            if (sendEmail)
                yield sendEmail({
                    subject: message.subject,
                    text: message.text.replace(/{{url}}/, `${protocol}://${req.headers.host}/verify?userId=${user.id}&token=${user.verificationHash}`),
                });
            req.flash("info", "Avisa el nou usuari, se li ha enviat un correu amb un link de verificacio que ha de clicar per validar el seu compte");
            res.redirect("/users");
        }
        catch (e) {
            if (e instanceof Error) {
                req.flash("error", e.message);
            }
            else {
                req.flash("error", "An unknown error occurred.");
            }
            res.redirect("/users");
            next(e);
        }
    });
}
function sendPasswordReset(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username: email } = req.body;
        // Validate the email and find the user in the database
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            req.flash("error", "Aquest usuari no existeix.");
            res.redirect("/account-recovery");
            return;
        }
        // Generate a reset token and store it in the user's document
        const resetPasswordHash = (0, random_hash_1.generateHash)({ length: 8 });
        user.resetPasswordHash = resetPasswordHash;
        user.resetPasswordTs = Date.now() + 3600000; // Token valid for 1 hour
        yield user.save();
        // Send an email to the user with the reset token
        const { sendEmail, message } = (0, sendEmail_1.useNodemailer)({
            to: user.email,
            model: "user",
            reason: "reset",
        });
        if (sendEmail)
            yield sendEmail({
                subject: message.subject,
                text: message.text.replace(/{{url}}/, `${protocol}://${req.headers.host}/reset?userId=${user.id}&token=${resetPasswordHash}`),
            });
        res.redirect("/reset-sent");
    });
}
function getAllUsers(next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield user_1.default.find({});
            return users;
        }
        catch (err) {
            next(err);
        }
    });
}
function getUser(req, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_1.default.findById(req.params.id).populate("department");
            const center = yield center_1.default.findById(user.center).populate("users");
            return { user, center };
        }
        catch (err) {
            next(err);
        }
    });
}
function updateUser(req, _res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { isAdmin, password } = req.body.user;
            const user = yield user_1.default.findByIdAndUpdate(id, Object.assign(Object.assign({}, req.body.user), { isAdmin: !!isAdmin }));
            if (password) {
                yield user.setPassword(password);
                yield user.save();
            }
            return user;
        }
        catch (err) {
            next(err);
        }
    });
}
function deleteUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            yield user_1.default.findByIdAndDelete(id);
            req.flash("success", "Usuari esborrat correctament");
            res.redirect("/users");
        }
        catch (err) {
            req.flash("error", "L'usuari no s'ha pogut esborrar");
            res.sendStatus(400);
            next(err);
        }
    });
}
function verifyUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { token, userId } = req.query;
            const user = yield user_1.default.findById(userId);
            if (!user) {
                req.flash("error", "L'usuari no existeix.");
                res.redirect("/");
            }
            if (!token) {
                req.flash("error", "El token esta buit");
                res.redirect("/");
            }
            const { verificationHash, verificationTs, isVerified } = user;
            if (isVerified) {
                req.flash("error", "L'usuari ja esta verificat.");
                res.redirect("/login");
            }
            const isTokenCorrect = token === verificationHash;
            const isTokenExpired = new Date().getTime() > verificationTs;
            if (!isTokenCorrect) {
                req.flash("error", "El token es invalid o ha expirat");
                res.redirect("/login");
            }
            if (isTokenExpired) {
                const { sendEmail, message } = (0, sendEmail_1.useNodemailer)({
                    to: user.email,
                    model: "user",
                    reason: "verify",
                });
                const newExpirationTs = (0, helpers_1.getExpirationTs)(60 * 10 * 1000); // 10 mins
                const newHash = (0, random_hash_1.generateHash)({ length: 8 });
                user.verificationTs = newExpirationTs;
                user.verificationHash = newHash;
                yield user.save();
                if (sendEmail)
                    yield sendEmail({
                        subject: message.subject,
                        text: message.text.replace(/{{url}}/, `${protocol}://${req.headers.host}/verify?userId=${user.id}&token=${newHash}`),
                    });
                req.flash("error", "El token ha expirat - N'hem enviat un de nou.");
                res.redirect("/login");
            }
            if (isTokenCorrect && !isTokenExpired) {
                user.isVerified = true;
                yield user.save();
                req.flash("success", "L'usuari ha estat activat correctament");
                res.redirect("/login");
            }
        }
        catch (err) {
            next(err);
        }
    });
}
//# sourceMappingURL=users.js.map