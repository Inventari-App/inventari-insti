import Area from "../models/area";
import { sortByKey } from "../utils/helpers";
import { renderNewForm, createItem } from "./helpers";

export const index = async (req, res, next) => {
  try {
    const areas = await Area.find({});
    res.render("areas/index", { areas: sortByKey(areas, "nom") });
  } catch (err) {
    next(err);
  }
};

export const renderNewForm = renderNewForm("areas/new");

export const createArea = createItem(Area, 'area');

export const showArea = async (req, res, next) => {
  try {
    const user = req.user;
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

export const getAreas = async (req, res, next) => {
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

export const renderEditForm = async (req, res, next) => {
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

export const updateArea = async (req, res, next) => {
  try {
    const { id } = req.params;
    const area = await Area.findByIdAndUpdate(id, { ...req.body });
    req.flash("success", "Area actualitzada correctament!");
    res.redirect(`/areas/${area._id}`);
  } catch (err) {
    next(err);
  }
};

export const deleteArea = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Area.findByIdAndDelete(id);
    req.flash("success", "Area eliminada correctament!");
    res.redirect("/areas");
  } catch (err) {
    next(err);
  }
};

