import express, { NextFunction, Request, Response } from "express";
import passport from "passport";
import catchAsync from "../utils/catchAsync";
import User from "../models/user";
import Department from "../models/department";
import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  createUser,
  verifyUser,
  createCenter,
  sendPasswordReset,
} from "../controllers/users";
import { isAdmin, isSameUserOrAdmin, validateRecaptcha } from "../middleware";
import Center from "../models/center";
import { localizeBoolean, sortByKey } from "../utils/helpers";

const router = express.Router();

router.get("/register", (_req: Request, res: Response) => {
  res.render("users/register");
});

router.get("/verify", catchAsync(verifyUser));

router.post(
  "/register-center",
  catchAsync(validateRecaptcha),
  catchAsync(createCenter),
);

router.post("/register", catchAsync(createUser));

router.get(
  "/users",
  isAdmin,
  catchAsync(async (_req: Request, res: Response, next: NextFunction) => {
    const users = await getAllUsers(next);
    res.render("users/index", { users: users ? sortByKey(users, "name") : [] });
  }),
);

router.get(
  "/users/new",
  isAdmin,
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const center = await Center.findById(req.currentUser?.center);
    if (!center) return next();

    res.render("users/new", { center });
  }),
);

router.get(
  "/users/:id",
  isSameUserOrAdmin,
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const getUserResp = await getUser(req, next);
    if (!getUserResp) return;
    const { user, center } = getUserResp;
    res.render("users/show", {
      user,
      center,
      isAdmin: req.currentUser?.isAdmin,
      isOwner: user.id == req.currentUser?.id,
      localizeBoolean,
    });
  }),
);

router.get(
  "/users/:id/edit",
  isSameUserOrAdmin,
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await getUser(req, next);
    const departments = await Department.find();
    res.render("users/edit", { ...user, departments, localizeBoolean });
  }),
);

router.put(
  "/users/:id",
  isSameUserOrAdmin,
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await updateUser(req, res, next);
    res.redirect(301, `/users/${user._id}`);
  }),
);

router.delete("/users/:id", isAdmin, catchAsync(deleteUser));

router.get("/users");

router.get(
  "/login",
  (_req: Request, res: Response, next: NextFunction) => {
    if (res.locals?.currentUser) {
      return res.redirect("/");
    }
    next();
  },
  (_req: Request, res: Response) => {
    res.render("users/login");
  },
);

router.get("/account-recovery", (_req: Request, res: Response) => {
  res.render("users/account-recovery");
});

router.get("/reset-sent", (_req: Request, res: Response) => {
  res.render("users/reset-sent");
});

router.get("/reset-error", (_req: Request, res: Response) => {
  res.render("users/reset-error");
});

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { isVerified } = await User.findByUsername(
        req.body.username,
        false,
      );
      if (!isVerified) {
        req.flash("error", "Has de verificar el teu correu electronic");
        res.redirect(301, "/login");
      } else {
        next();
      }
    } catch {
      req.flash("error", "L'usuari o el password son incorrectes");
      res.redirect(301, "/login");
    }
  },
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
    failureMessage: true,
    keepSessionInfo: true,
  }),
  (req, res) => {
    req.flash("success", "Benvingut/da de nou!");
    const redirectUrl = req.session.returnTo || "/invoices";
    //delete req.session.returnTo;
    res.redirect(301, redirectUrl);
  },
);

router.post("/account-recovery", catchAsync(sendPasswordReset));

router.get("/reset", async (req, res) => {
  const { token, userId } = req.query;
  const user = await User.findById(userId);
  if (
    !user ||
    user.resetPasswordHash !== token ||
    user.resetPasswordTs < Date.now()
  ) {
    return res.redirect("/reset-error");
  }
  res.render("users/reset", { token, userId });
});

router.post("/reset", async (req, res) => {
  const { userId, token, password: newPassword } = req.body;
  const user = await User.findById(userId);

  if (
    !user ||
    user.resetPasswordHash !== token ||
    user.resetPasswordTs < Date.now()
  ) {
    return res.redirect("/reset-error");
  }

  // Update the user's password and clear the reset token
  await user.setPassword(newPassword);
  user.resetPasswordHash = undefined;
  user.resetPasswordTs = undefined;
  await user.save();

  req.flash("success", "La contrasenya s'ha restablert amb exit.");
  res.redirect("/login");
});

router.post("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect(301, "/login");
  });
});

export default router;
