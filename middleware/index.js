const ExpressError = require("../utils/ExpressError.js");
const User = require("../models/user.js");

module.exports.validateSchema = (schema) =>
  (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  };

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    //res.session.returnTo = req.originalUrl;
    req.flash("error", "Has d'estar connectat/da");
    return res.redirect("/login");
  }
  next();
};

module.exports.isSameUser = async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user._id.equals(req.user._id)) {
    req.flash("error", "No tens permisos per fer això!");
    return res.redirect(`/invoices`);
  }
  next();
};

module.exports.isSameUserOrAdmin = async (req, res, next) => {
  const { id } = req.params;
  const { id: userId, isAdmin } = req.user;
  const user = await User.findById(id);
  if (user._id != userId && !isAdmin) {
    req.flash("error", "No tens permisos per fer això!");
    return res.redirect(`/invoices`);
  }
  next();
};

module.exports.isResponsable = (Model) => 
  async (req, res, next) => {
    const { id } = req.params;
    const model = await Model.findById(id);
    if (!model.responsable.equals(req.user._id)) {
      req.flash("error", "No tens permisos per fer això!");
      return res.redirect(`/invoices`);
    }
    next();
  };

module.exports.isResponsableOrAdmin = (Model) => 
  async (req, res, next) => {
    const { id } = req.params;
    const { id: userId, isAdmin } = req.user;
    const model = await Model.findById(id);
    if (model.responsable._id != userId && !isAdmin) {
      req.flash("error", "No tens permisos per fer això!");
      return res.redirect(`/invoices`);
    }
    next();
  };


module.exports.isAdmin = async (req, res, next) => {
  const { id: userId, isAdmin } = req.user;
  const user = await User.findById(userId);
  if (!user.isAdmin) {
    req.flash("error", "No tens permisos per fer això!");
    return res.redirect(`/invoices`);
  }
  next();
};
