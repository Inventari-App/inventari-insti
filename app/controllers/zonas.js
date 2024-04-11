const Zona = require("../models/zona");
const { renderNewForm, createItem } = require("./helpers");

module.exports.index = async (req, res, next) => {
  try {
    const zonas = await Zona.find({});
    res.render("zonas/index", { zonas });
  } catch (err) {
    next(err);
  }
};

module.exports.renderNewForm = renderNewForm("zonas/new")

module.exports.createZona = createItem(Zona, 'zona')

module.exports.showZona = async (req, res, next) => {
  try {
    const user = req.user
    const zona = await Zona.findById(req.params.id).populate("responsable");

    if (!zona) {
      req.flash("error", "No es pot trobar la zona!");
      return res.redirect("/zonas");
    }
    res.render("zonas/show", { zona, isAdmin: user.isAdmin });
  } catch (err) {
    next(err);
  }
};

module.exports.getZonas = async (req, res, next) => {
  try {
    const zonas = await Zona.find();

    if (!zonas) {
      req.flash("error", "No es poden trobar zones!");
      return;
    }
    res.json(zonas);
  } catch (err) {
    next(err);
  }
};

module.exports.renderEditForm = async (req, res, next) => {
  try {
    const zona = await Zona.findById(req.params.id);
    if (!zona) {
      req.flash("error", "No es pot trobar la zona!");
      return res.redirect("/zonas");
    }
    res.render("zonas/edit", { zona });
  } catch (err) {
    next(err);
  }
};

module.exports.updateZona = async (req, res, next) => {
  try {
    const { id } = req.params;

    const zona = await Zona.findByIdAndUpdate(id, { ...req.body.zona });
    req.flash("success", "Zona actualitzada correctament!");
    res.redirect(`/zonas/${zona._id}`);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteZona = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Zona.findByIdAndDelete(id);
    req.flash("success", "Zona eliminada correctament!");
    res.redirect("/zonas");
  } catch (err) {
    next(err);
  }
};
