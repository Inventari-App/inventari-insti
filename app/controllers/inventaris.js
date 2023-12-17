const inventari = require("../models/inventari");
const Inventari = require("../models/inventari");
const Department = require("../models/department");
const Unitat = require("../models/unitat");

module.exports.index = async (req, res) => {
  const inventaris = await Inventari.find({})
    .populate({
      path: "responsable",
      populate: { path: "department" },
    })
    .sort({ createdAt: -1 });

  res.render("inventaris/index", { inventaris });
};

module.exports.renderNewForm = async (req, res) => {
  const unitats = await Unitat.find();
  res.render("inventaris/new", { unitats });
};

module.exports.createInventari = async (req, res, next) => {
  try {
    let inventariBody = req.body.inventari;
    const user = req.user
    const department = await Department.findById(user.department)
    const inventari = new Inventari({ ...inventariBody, departament: department });
    await inventari.save();
    req.flash("success", "Inventari creat correctament!");
    res.redirect("/inventaris");
  } catch (error) {
    req.flash("error", "Alguna cosa no ha anat be al crear l'inventari.");
    res.redirect("/inventaris");
  }
};

module.exports.createInventaris = async (req, res, next) => {
  try {
    const inventaris = req.body.inventaris;
    await Inventari.create(inventaris);
    req.flash("success", "Inventaris creats correctament!");
    res.status(201)
  } catch (error) {
    req.flash("error", "Alguna cosa no ha anat be al crear els inventaris.");
    res.status(400)
  }
  next()
};

module.exports.showInventari = async (req, res, next) => {
  const { user } = req;
  const inventari = await Inventari.findById(req.params.id).populate("responsable");
  const responsable = inventari.responsable;

  if (!inventari) {
    req.flash("error", "No es pot trobar l'inventari!");
    return res.redirect("/inventaris");
  }
  res.render("inventaris/show", {
    inventari,
    isAdmin: req.user.isAdmin,
    isOwner: responsable && responsable._id.equals(user.id),
  });
};

module.exports.renderEditForm = async (req, res) => {
  const inventari = await Inventari.findById(req.params.id);
  const unitats = await Unitat.find();

  if (!inventari) {
    req.flash("error", "No es pot trobar l'inventari!");
    return res.redirect("/inventaris");
  }
  res.render("inventaris/edit", { inventari, unitats });
};

module.exports.updateInventari = async (req, res) => {
  const { id } = req.params;

  const inventari = await Inventari.findByIdAndUpdate(id, { ...req.body.inventari });
  req.flash("success", "Inventari actualitzat correctament!");
  res.redirect(`/inventaris/${inventari._id}`);
};

module.exports.deleteInventari = async (req, res) => {
  const { id } = req.params;
  await Inventari.findByIdAndDelete(id);
  req.flash("success", "Inventari eliminat correctament!");
  res.redirect("/inventaris");
};
