const Proveidor = require("../models/proveidor");

module.exports.index = async (req, res, next) => {
  try {
    const proveidors = await Proveidor.find({});
    res.render("proveidors/index", { proveidors });
  } catch (err) {
    next(err);
  }
};

module.exports.renderNewForm = (req, res, next) => {
  try {
    res.render("proveidors/new");
  } catch (err) {
    next(err);
  }
};

module.exports.createProveidor = async (req, res, next) => {
  try {
    let proveidorBody = req.body.proveidor;
    proveidorBody = { ...proveidorBody };
    const proveidor = new Proveidor(proveidorBody);
    proveidor.responsable = req.user._id;
    await proveidor.save();

    if (req.query.tab) {
      return res.status(201).send(`
        <script>window.close()</script>
      `)
    }

    req.flash("success", "Proveidor creat correctament!");
    res.status(201).redirect("/proveidors")
  } catch (err) {
    if (err.code == 11000) {
      req.flash("error", "Un proveidor amb el mateix nom ja existeix.")
      return res.redirect(`/proveidors/new${req.query.tab ? "?tab=true" : ""}`)
    }
    next(err);
  }
};

module.exports.showProveidor = async (req, res, next) => {
  try {
    const user = req.user
    const proveidor = await Proveidor.findById(req.params.id).populate(
      "responsable",
    );

    if (!proveidor) {
      req.flash("error", "No es pot trobar el proveidor!");
      return res.redirect("/proveidors");
    }

    res.render("proveidors/show", { proveidor, isAdmin: user.isAdmin });
  } catch (err) {
    next(err);
  }
};

module.exports.getProveidors = async (req, res, next) => {
  try {
    const proveidors = await Proveidor.find();

    if (!proveidors) {
      req.flash("error", "No es poden trobar proveidors!");
      return;
    }
    res.json(proveidors);
  } catch (err) {
    next(err);
  }
};

module.exports.renderEditForm = async (req, res, next) => {
  try {
    const proveidor = await Proveidor.findById(req.params.id);
    if (!proveidor) {
      req.flash("error", "No es pot trobar el proveidor!");
      return res.redirect("/proveidors");
    }
    res.render("proveidors/edit", { proveidor });
  } catch (err) {
    next(err);
  }
};

module.exports.updateProveidor = async (req, res, next) => {
  try {
    const { id } = req.params;

    const proveidor = await Proveidor.findByIdAndUpdate(id, {
      ...req.body.proveidor,
    });
    req.flash("success", "Proveidor actualitzat correctament!");
    res.redirect(`/proveidors/${proveidor._id}`);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteProveidor = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Proveidor.findByIdAndDelete(id);
    req.flash("success", "Proveidor eliminat correctament!");
    res.redirect("/proveidors");
  } catch (err) {
    next(err);
  }
};
