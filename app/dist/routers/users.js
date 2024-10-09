var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import passport from "passport";
import catchAsync from "../utils/catchAsync";
import User from "../models/user";
import Department from "../models/department";
import { getAllUsers, getUser, updateUser, deleteUser, createUser, verifyUser, createCenter, sendPasswordReset, } from "../controllers/users";
import { isAdmin, isSameUserOrAdmin, validateRecaptcha } from "../middleware";
import Center from "../models/center";
import { localizeBoolean, sortByKey } from "../utils/helpers";
const router = express.Router();
router.get("/register", (_req, res) => {
    res.render("users/register");
});
router.get("/verify", catchAsync(verifyUser));
router.post("/register-center", catchAsync(validateRecaptcha), catchAsync(createCenter));
router.post("/register", catchAsync(createUser));
router.get("/users", isAdmin, catchAsync((_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield getAllUsers(next);
    res.render("users/index", { users: users ? sortByKey(users, "name") : [] });
})));
router.get("/users/new", isAdmin, catchAsync((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const center = yield Center.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.center);
    if (!center)
        return next();
    res.render("users/new", { center });
})));
router.get("/users/:id", isSameUserOrAdmin, catchAsync((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const getUserResp = yield getUser(req, next);
    if (!getUserResp)
        return;
    const { user, center } = getUserResp;
    res.render("users/show", {
        user,
        center,
        isAdmin: (_a = req.user) === null || _a === void 0 ? void 0 : _a.isAdmin,
        isOwner: user.id == ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id),
        localizeBoolean,
    });
})));
router.get("/users/:id/edit", isSameUserOrAdmin, catchAsync((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield getUser(req, next);
    const departments = yield Department.find();
    res.render("users/edit", Object.assign(Object.assign({}, user), { departments, localizeBoolean }));
})));
router.put("/users/:id", isSameUserOrAdmin, catchAsync((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield updateUser(req, res, next);
    res.redirect(301, `/users/${user._id}`);
})));
router.delete("/users/:id", isAdmin, catchAsync(deleteUser));
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
        const { isVerified } = yield User.findByUsername(req.body.username, false);
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
}), passport.authenticate("local", {
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
router.post("/account-recovery", catchAsync(sendPasswordReset));
router.get("/reset", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, userId } = req.query;
    const user = yield User.findById(userId);
    if (!user ||
        user.resetPasswordHash !== token ||
        user.resetPasswordTs < Date.now()) {
        return res.redirect("/reset-error");
    }
    res.render("users/reset", { token, userId });
}));
router.post("/reset", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, token, password: newPassword } = req.body;
    const user = yield User.findById(userId);
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
export default router;
