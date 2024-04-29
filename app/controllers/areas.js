const Area = require("../models/area");
const { sortByKey } = require("../utils/helpers");
const { renderNewForm, createItem } = require("./helpers");

module.exports.index = async (req, res, next) => {
  try {
    const areas = await Area.find({});
    res.render("areas/index", { areas: sortByKey(areas, "nom") });
  } catch (err) {
    next(err);
  }
};

module.exports.renderNewForm = renderNewForm("areas/new")

module.exports.createArea = createItem(Area, 'area')

module.exports.showArea = async (req, res, next) => {
  try {
    const user = req.user
    const area = await Area.findById(req.params.id).populate("responsable");

    if (!area) {
      req.flash("error", "No es pot trobar la area!");
      return res.redirect("/areas");
    }
    res.render("areas/show", { area, isAdmin: user.isAdmin });
  } catch (err) {
    next(err);
  }
};

module.exports.getAreas = async (req, res, next) => {
  try {
    const areas = await Area.find();

    if (!areas) {
      req.flash("error", "No es poden trobar zones!");
      return;
    }
    res.json(areas);
  } catch (err) {
    next(err);
  }
};

module.exports.renderEditForm = async (req, res, next) => {
  try {
    const area = await Area.findById(req.params.id);
    if (!area) {
      req.flash("error", "No es pot trobar la area!");
      return res.redirect("/areas");
    }
    res.render("areas/edit", { area });
  } catch (err) {
    next(err);
  }
};

module.exports.updateArea = async (req, res, next) => {
  try {
    const { id } = req.params;
    const area = await Area.findByIdAndUpdate(id, { ...req.body.area });
    req.flash("success", "Area actualitzada correctament!");
    res.redirect(`/areas/${area._id}`);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteArea = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Area.findByIdAndDelete(id);
    req.flash("success", "Area eliminada correctament!");
    res.redirect("/areas");
  } catch (err) {
    next(err);
  }
};
