const Planta = require("../models/planta");
const { sortByKey } = require("../utils/helpers");
const { renderNewForm, createItem } = require("./helpers");

module.exports.index = async (req, res, next) => {
  try {
    const plantas = await Planta.find({});
    res.render("plantas/index", { plantas: sortByKey(plantas, "nom") });
  } catch (err) {
    next(err);
  }
};

module.exports.renderNewForm = renderNewForm("plantas/new")

module.exports.createPlanta = createItem(Planta, 'planta')

module.exports.showPlanta = async (req, res, next) => {
  try {
    const user = req.user
    const planta = await Planta.findById(req.params.id).populate("responsable");

    if (!planta) {
      req.flash("error", "No es pot trobar la planta!");
      return res.redirect("/plantas");
    }
    res.render("plantas/show", { planta, isAdmin: user.isAdmin });
  } catch (err) {
    next(err);
  }
};

module.exports.getPlantas = async (req, res, next) => {
  try {
    const plantas = await Planta.find();

    if (!plantas) {
      req.flash("error", "No es poden trobar zones!");
      return;
    }
    res.json(plantas);
  } catch (err) {
    next(err);
  }
};

module.exports.renderEditForm = async (req, res, next) => {
  try {
    const planta = await Planta.findById(req.params.id);
    if (!planta) {
      req.flash("error", "No es pot trobar la planta!");
      return res.redirect("/plantas");
    }
    res.render("plantas/edit", { planta });
  } catch (err) {
    next(err);
  }
};

module.exports.updatePlanta = async (req, res, next) => {
  try {
    const { id } = req.params;

    const planta = await Planta.findByIdAndUpdate(id, { ...req.body.planta });
    req.flash("success", "Planta actualitzada correctament!");
    res.redirect(`/plantas/${planta._id}`);
  } catch (err) {
    next(err);
  }
};

module.exports.deletePlanta = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Planta.findByIdAndDelete(id);
    req.flash("success", "Planta eliminada correctament!");
    res.redirect("/plantas");
  } catch (err) {
    next(err);
  }
};
