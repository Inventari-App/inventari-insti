import { NextFunction, Request, Response } from "express";
import Unitat from "../models/unitat";
import { sortByKey } from "../utils/helpers";
import {
  renderNewForm as _renderNewForm,
  createItem as _createItem,
} from "./helpers";

export const index = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const unitats = await Unitat.find({});
    res.render("unitats/index", { unitats: sortByKey(unitats, "nom") });
  } catch (err) {
    next(err);
  }
};

export const renderNewForm = _renderNewForm("unitats/new");

export const createUnitat = _createItem(Unitat, "unitat");

export const showUnitat = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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
      isAdmin: user?.isAdmin,
      isOwner: responsable && responsable._id.equals(user?.id),
    });
  } catch (err) {
    next(err);
  }
};

export const getUnitats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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

export const renderEditForm = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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

export const updateUnitat = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const unitat = await Unitat.findByIdAndUpdate(id, { ...req.body });
    req.flash("success", "Unitat actualitzat correctament!");
    res.redirect(`/unitats/${unitat._id}`);
  } catch (err) {
    next(err);
  }
};

export const deleteUnitat = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    await Unitat.findByIdAndDelete(id);
    req.flash("success", "Unitat eliminat correctament!");
    res.redirect("/unitats");
  } catch (err) {
    next(err);
  }
};
