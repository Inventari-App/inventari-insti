const Unitat = require("../models/unitat");
const { sortByKey } = require("../utils/helpers");
const { renderNewForm, createItem } = require("./helpers");

module.exports.index = async (req, res, next) => {
  try {
    const unitats = await Unitat.find({});
    res.render("unitats/index", { unitats: sortByKey(unitats, "nom") });
  } catch (err) {
    next(err);
  }
};

module.exports.renderNewForm = renderNewForm("unitats/new")

module.exports.createUnitat = createItem(Unitat, 'unitat',
  (req, res, err) => {
    if (err.code == 11000) {
      req.flash("error", "Una unitat amb el mateix nom ja existeix.")
      return res.redirect(`/unitats/new${req.query.tab ? "?tab=true" : ""}`)
    }
    next(err);
  }
)

module.exports.showUnitat = async (req, res, next) => {
  try {
    const { user } = req;
    const unitat = await Unitat.findById(req.params.id).populate("responsable");
    const responsable = unitat.responsable;

    if (!unitat) {
      req.flash("error", "No es pot trobar l'unitat!");
      return res.redirect("/unitats");
    }
    res.render("unitats/show", {
      unitat,
      isAdmin: user.isAdmin,
      isOwner: responsable && responsable._id.equals(user.id),
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getUnitats = async (req, res, next) => {
  try {
    const unitats = await Unitat.find();

    if (!unitats) {
      req.flash("error", "No es poden trobar unitats!");
      return;
    }
    res.json(unitats);
  } catch (err) {
    next(err);
  }
};

module.exports.renderEditForm = async (req, res, next) => {
  try {
    const unitat = await Unitat.findById(req.params.id);
    if (!unitat) {
      req.flash("error", "No es pot trobar l'unitat!");
      return res.redirect("/unitats");
    }
    res.render("unitats/edit", { unitat });
  } catch (err) {
    next(err);
  }
};

module.exports.updateUnitat = async (req, res, next) => {
  try {
    const { id } = req.params;

    const unitat = await Unitat.findByIdAndUpdate(id, { ...req.body });
    req.flash("success", "Unitat actualitzat correctament!");
    res.redirect(`/unitats/${unitat._id}`);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteUnitat = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Unitat.findByIdAndDelete(id);
    req.flash("success", "Unitat eliminat correctament!");
    res.redirect("/unitats");
  } catch (err) {
    next(err);
  }
};
