const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  createUser,
  verifyUser,
  createCenter,
} = require("../controllers/users");
const { isAdmin, isSameUserOrAdmin } = require("../middleware");
const Center = require("../models/center");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.get("/verify", catchAsync(async (req, res, next) => {
  await verifyUser(req, res, next)
}))

router.post(
  "/register-center",
  catchAsync(async (req, res, next) => {
    await createCenter(req, res, next)
  })
);

router.post(
  "/register",
  catchAsync(async (req, res, next) => {
    await createUser(req, res, next)
  })
);

router.get(
  "/users",
  isAdmin,
  catchAsync(async (req, res) => {
    const users = await getAllUsers(req);
    res.render("users/index", { users });
  })
);

router.get(
  "/users/new",
  isAdmin,
  catchAsync(async (req, res, next) => {
    const center = await Center.findById(req.user.center)
    if (!center) return next()

    res.render("users/new", { center });
  })
);

router.get(
  "/users/:id",
  isSameUserOrAdmin,
  catchAsync(async (req, res) => {
    const user = await getUser(req);
    res.render("users/show", { user });
  })
);

router.get(
  "/users/:id/edit",
  isSameUserOrAdmin,
  catchAsync(async (req, res) => {
    const user = await getUser(req);
    res.render("users/edit", { user });
  })
);

router.put(
  "/users/:id",
  isSameUserOrAdmin,
  catchAsync(async (req, res) => {
    const user = await updateUser(req);
    res.redirect(301, `/users/${user._id}`);
  })
);

router.delete(
  "/users/:id",
  isAdmin,
  catchAsync(deleteUser)
);

router.get("/users");

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  async (req, res, next) => {
    try {
      const { isVerified } = await User.findByUsername(req.body.username)
      if (!isVerified) {
        req.flash('error', 'Has de verificar el teu correu electronic')
        res.redirect(301, '/login')
      } else {
        next()
      }
    } catch (error) {
      req.flash("error", "L'usuari o el password son incorrectes")
      res.redirect(301, "/login")
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
  }
);

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Adéu!");
    res.redirect(301, "/login");
  });
});

// forgot route

router.get;

module.exports = router;
