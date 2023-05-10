const ExpressError = require("../utils/ExpressError.js");
const Area = require("../models/area.js");
const Invoice = require("../models/invoice.js");

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

module.exports.isResponsable = async (req, res, next) => {
  const { id } = req.params;
  const area = await Area.findById(id);
  if (!area.responsable.equals(req.user._id)) {
    req.flash("error", "No tens permisos per fer això!");
    return res.redirect(`/areas/${id}`);
  }
  next();
};

module.exports.isResponsableOrAdmin = async (req, res, next) => {
  const { id } = req.params;
  const { id: userId, isAdmin } = req.user;
  const invoice = await Invoice.findById(id);
  if (invoice.responsable._id != userId && !isAdmin) {
    req.flash("error", "No tens permisos per fer això!");
    return res.redirect(`/invoices/${id}`);
  }
  next();
};

module.exports.isAdmin = async (req, res, next) => {
  const { id } = req.params;
  const { id: userId, isAdmin } = req.user;
  const invoice = await Invoice.findById(id);
  if (invoice.responsable._id != userId && !isAdmin) {
    req.flash("error", "No tens permisos per fer això!");
    return res.redirect(`/invoices/${id}`);
  }
  next();
};
