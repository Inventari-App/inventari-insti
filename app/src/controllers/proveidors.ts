import Proveidor from "../models/proveidor";
import { sortByKey } from "../utils/helpers";
import { renderNewForm, createItem } from "./helpers";

export const index = async (req, res, next) => {
  try {
    const proveidors = await Proveidor.find({});
    res.render("proveidors/index", { proveidors: sortByKey(proveidors, "nom") });
  } catch (err) {
    next(err);
  }
};

export const renderNewForm = renderNewForm("proveidors/new");

export const createProveidor = createItem(Proveidor, 'proveidor', (req, res, err) => {
  if (err.code == 11000) {
    req.flash("error", "Un proveidor amb el mateix nom ja existeix.");
    return res.redirect(`/proveidors/new${req.query.tab ? "?tab=true" : ""}`);
  }
  next(err);
});

export const showProveidor = async (req, res, next) => {
  try {
    const user = req.user;
    const proveidor = await Proveidor.findById(req.params.id).populate("responsable");

    if (!proveidor) {
      req.flash("error", "No es pot trobar el proveidor!");
      return res.redirect("/proveidors");
    }

    res.render("proveidors/show", { proveidor, isAdmin: user.isAdmin });
  } catch (err) {
    next(err);
  }
};

export const getProveidors = async (req, res, next) => {
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

export const renderEditForm = async (req, res, next) => {
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

export const updateProveidor = async (req, res, next) => {
  try {
    const { id } = req.params;

    const proveidor = await Proveidor.findByIdAndUpdate(id, {
      ...req.body,
    });
    req.flash("success", "Proveidor actualitzat correctament!");
    res.redirect(`/proveidors/${proveidor._id}`);
  } catch (err) {
    next(err);
  }
};

export const deleteProveidor = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Proveidor.findByIdAndDelete(id);
    req.flash("success", "Proveidor eliminat correctament!");
    res.redirect("/proveidors");
  } catch (err) {
    next(err);
  }
};

