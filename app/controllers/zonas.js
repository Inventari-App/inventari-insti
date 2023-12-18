const Zona = require("../models/zona");

module.exports.index = async (req, res, next) => {
  try {
    const zonas = await Zona.find({});
    res.render("zonas/index", { zonas });
  } catch (err) {
    next(err);
  }
};

module.exports.renderNewForm = (req, res, next) => {
  try {
    const { tab } = req.query;
    res.render("zonas/new", { autoclose: tab });
  } catch (err) {
    next(err);
  }
};

module.exports.createZona = async (req, res, next) => {
  try {
    let zonaBody = req.body.zona;
    zonaBody = { ...zonaBody };
    const zona = new Zona(zonaBody);
    zona.responsable = req.user._id;
    await zona.save();
    req.flash("success", "Zona creada correctament!");
    if (zonaBody.autoclose) {
      res.redirect("/autoclose");
    } else {
      res.redirect(`/zonas/${zona._id}`);
    }
  } catch (err) {
    next(err);
  }
};

module.exports.showZona = async (req, res, next) => {
  try {
    const zona = await Zona.findById(req.params.id).populate("responsable");

    if (!zona) {
      req.flash("error", "No es pot trobar la zona!");
      return res.redirect("/zonas");
    }
    res.render("zonas/show", { zona });
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
