const Unitat = require("../models/unitat");

module.exports.index = async (req, res, next) => {
  try {
    const unitats = await Unitat.find({});
    res.render("unitats/index", { unitats });
  } catch (err) {
    next(err);
  }
};

module.exports.renderNewForm = (req, res, next) => {
  try {
    res.render("unitats/new");
  } catch (err) {
    next(err);
  }
};

module.exports.createUnitat = async (req, res, next) => {
  try {
    let unitatBody = req.body.unitat;
    unitatBody = { ...unitatBody };
    const unitat = new Unitat(unitatBody);
    unitat.responsable = req.user._id;
    await unitat.save();

    if (req.query.tab) {
      return res.status(201).send(`
        <script>window.close()</script>
      `)

    }

    req.flash("success", "Unitat creada correctament!");
    res.status(201).redirect("/unitats")
  } catch (err) {
    if (err.code == 11000) {
      req.flash("error", "Una unitat amb el mateix nom ja existeix.")
      return res.redirect(`/unitats/new${req.query.tab ? "?tab=true" : ""}`)
    }
    next(err);
  }
};

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

    const unitat = await Unitat.findByIdAndUpdate(id, { ...req.body.unitat });
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
