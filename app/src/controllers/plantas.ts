import Planta from "../models/planta";
import { sortByKey } from "../utils/helpers";
import { renderNewForm, createItem } from "./helpers";

export const index = async (req, res, next) => {
  try {
    const plantas = await Planta.find({});
    res.render("plantas/index", { plantas: sortByKey(plantas, "nom") });
  } catch (err) {
    next(err);
  }
};

export const renderNewForm = renderNewForm("plantas/new");

export const createPlanta = createItem(Planta, 'planta');

export const showPlanta = async (req, res, next) => {
  try {
    const user = req.user;
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

export const getPlantas = async (req, res, next) => {
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

export const renderEditForm = async (req, res, next) => {
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

export const updatePlanta = async (req, res, next) => {
  try {
    const { id } = req.params;

    const planta = await Planta.findByIdAndUpdate(id, { ...req.body });
    req.flash("success", "Planta actualitzada correctament!");
    res.redirect(`/plantas/${planta._id}`);
  } catch (err) {
    next(err);
  }
};

export const deletePlanta = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Planta.findByIdAndDelete(id);
    req.flash("success", "Planta eliminada correctament!");
    res.redirect("/plantas");
  } catch (err) {
    next(err);
  }
};

