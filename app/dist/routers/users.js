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
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const user_1 = __importDefault(require("../models/user"));
const department_1 = __importDefault(require("../models/department"));
const users_1 = require("../controllers/users");
const middleware_1 = require("../middleware");
const center_1 = __importDefault(require("../models/center"));
const helpers_1 = require("../utils/helpers");
const router = express_1.default.Router();
router.get("/register", (_req, res) => {
    res.render("users/register");
});
router.get("/verify", (0, catchAsync_1.default)(users_1.verifyUser));
router.post("/register-center", (0, catchAsync_1.default)(middleware_1.validateRecaptcha), (0, catchAsync_1.default)(users_1.createCenter));
router.post("/register", (0, catchAsync_1.default)(users_1.createUser));
router.get("/users", middleware_1.isAdmin, (0, catchAsync_1.default)((_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield (0, users_1.getAllUsers)(next);
    res.render("users/index", { users: users ? (0, helpers_1.sortByKey)(users, "name") : [] });
})));
router.get("/users/new", middleware_1.isAdmin, (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const center = yield center_1.default.findById((_a = req.currentUser) === null || _a === void 0 ? void 0 : _a.center);
    if (!center)
        return next();
    res.render("users/new", { center });
})));
router.get("/users/:id", middleware_1.isSameUserOrAdmin, (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const getUserResp = yield (0, users_1.getUser)(req, next);
    if (!getUserResp)
        return;
    const { user, center } = getUserResp;
    res.render("users/show", {
        user,
        center,
        isAdmin: (_a = req.currentUser) === null || _a === void 0 ? void 0 : _a.isAdmin,
        isOwner: user.id == ((_b = req.currentUser) === null || _b === void 0 ? void 0 : _b.id),
        localizeBoolean: helpers_1.localizeBoolean,
    });
})));
router.get("/users/:id/edit", middleware_1.isSameUserOrAdmin, (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, users_1.getUser)(req, next);
    const departments = yield department_1.default.find();
    res.render("users/edit", Object.assign(Object.assign({}, user), { departments, localizeBoolean: helpers_1.localizeBoolean }));
})));
router.put("/users/:id", middleware_1.isSameUserOrAdmin, (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, users_1.updateUser)(req, res, next);
    res.redirect(301, `/users/${user._id}`);
})));
router.delete("/users/:id", middleware_1.isAdmin, (0, catchAsync_1.default)(users_1.deleteUser));
router.get("/users");
router.get("/login", (_req, res, next) => {
    var _a;
    if ((_a = res.locals) === null || _a === void 0 ? void 0 : _a.currentUser) {
        return res.redirect("/");
    }
    next();
}, (_req, res) => {
    res.render("users/login");
});
router.get("/account-recovery", (_req, res) => {
    res.render("users/account-recovery");
});
router.get("/reset-sent", (_req, res) => {
    res.render("users/reset-sent");
});
router.get("/reset-error", (_req, res) => {
    res.render("users/reset-error");
});
router.post("/login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { isVerified } = yield user_1.default.findByUsername(req.body.username, false);
        if (!isVerified) {
            req.flash("error", "Has de verificar el teu correu electronic");
            res.redirect(301, "/login");
        }
        else {
            next();
        }
    }
    catch (_a) {
        req.flash("error", "L'usuari o el password son incorrectes");
        res.redirect(301, "/login");
    }
}), passport_1.default.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
    failureMessage: true,
    keepSessionInfo: true,
}), (req, res) => {
    req.flash("success", "Benvingut/da de nou!");
    const redirectUrl = req.session.returnTo || "/invoices";
    //delete req.session.returnTo;
    res.redirect(301, redirectUrl);
});
router.post("/account-recovery", (0, catchAsync_1.default)(users_1.sendPasswordReset));
router.get("/reset", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, userId } = req.query;
    const user = yield user_1.default.findById(userId);
    if (!user ||
        user.resetPasswordHash !== token ||
        user.resetPasswordTs < Date.now()) {
        return res.redirect("/reset-error");
    }
    res.render("users/reset", { token, userId });
}));
router.post("/reset", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, token, password: newPassword } = req.body;
    const user = yield user_1.default.findById(userId);
    if (!user ||
        user.resetPasswordHash !== token ||
        user.resetPasswordTs < Date.now()) {
        return res.redirect("/reset-error");
    }
    // Update the user's password and clear the reset token
    yield user.setPassword(newPassword);
    user.resetPasswordHash = undefined;
    user.resetPasswordTs = undefined;
    yield user.save();
    req.flash("success", "La contrasenya s'ha restablert amb exit.");
    res.redirect("/login");
}));
router.post("/logout", (req, res, next) => {
    req.logout(function (err) {
        if (err)
            return next(err);
        res.redirect(301, "/login");
    });
});
exports.default = router;
//# sourceMappingURL=users.js.map