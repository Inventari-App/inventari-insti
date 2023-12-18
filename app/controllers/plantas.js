const Planta = require("../models/planta");

module.exports.index = async (req, res, next) => {
  try {
    const plantas = await Planta.find({});
    res.render("plantas/index", { plantas });
  } catch (err) {
    next(err);
  }
};

module.exports.renderNewForm = (req, res, next) => {
  try {
    const { tab } = req.query;
    res.render("plantas/new", { autoclose: tab });
  } catch (err) {
    next(err);
  }
};

module.exports.createPlanta = async (req, res, next) => {
  try {
    let plantaBody = req.body.planta;
    plantaBody = { ...plantaBody };
    const planta = new Planta(plantaBody);
    planta.responsable = req.user._id;
    await planta.save();
    req.flash("success", "Planta creada correctament!");
    if (plantaBody.autoclose) {
      res.redirect("/autoclose");
    } else {
      res.redirect(`/plantas/${planta._id}`);
    }
    res.redirect(`/plantas/${planta._id}`);
  } catch (err) {
    next(err);
  }
};

module.exports.showPlanta = async (req, res, next) => {
  try {
    const planta = await Planta.findById(req.params.id).populate("responsable");

    if (!planta) {
      req.flash("error", "No es pot trobar la planta!");
      return res.redirect("/plantas");
    }
    res.render("plantas/show", { planta });
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
