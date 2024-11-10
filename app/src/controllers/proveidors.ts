import { Request, Response, NextFunction } from "express";
import Proveidor from "../models/proveidor";
import { sortByKey } from "../utils/helpers";
import { renderNewForm as _renderNewForm, createItem } from "./helpers";

export const index = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const proveidors = await Proveidor.find({});
    res.render("proveidors/index", {
      proveidors: sortByKey(proveidors, "nom"),
    });
  } catch (err) {
    next(err);
  }
};

export const renderNewForm = _renderNewForm("proveidors/new");

export const createProveidor = createItem(Proveidor, "proveidor");

export const showProveidor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    const proveidor = await Proveidor.findById(req.params.id).populate(
      "responsable",
    );

    if (!proveidor) {
      req.flash("error", "No es pot trobar el proveidor!");
      return res.redirect("/proveidors");
    }

    res.render("proveidors/show", { proveidor, isAdmin: user?.isAdmin });
  } catch (err) {
    next(err);
  }
};

export const getProveidors = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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

export const renderEditForm = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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

export const updateProveidor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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

export const deleteProveidor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    await Proveidor.findByIdAndDelete(id);
    req.flash("success", "Proveidor eliminat correctament!");
    res.redirect("/proveidors");
  } catch (err) {
    next(err);
  }
};
