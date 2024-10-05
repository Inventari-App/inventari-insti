import { NextFunction, Request, Response } from "express";
import Item from "../models/item";
import { localizeBoolean } from "../utils/helpers";
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
    const items = await Item.find({}).populate("responsable");
    res.render("items/index", { items, localizeBoolean });
  } catch (err) {
    next(err);
  }
};

export const renderNewForm = _renderNewForm("items/new");

export const createItem = _createItem(Item, "item");

export const showItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user } = req;
    const item = await Item.findById(req.params.id).populate("responsable");
    const responsable = item.responsable;

    if (!item) {
      req.flash("error", "No es pot trobar l'item!");
      return res.redirect("/items");
    }
    res.render("items/show", {
      item,
      isAdmin: user?.isAdmin,
      isOwner: responsable && responsable._id.equals(user?.id),
      localizeBoolean,
    });
  } catch (err) {
    next(err);
  }
};

export const getItems = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const items = await Item.find().populate("responsable");

    if (!items) {
      req.flash("error", "No es poden trobar items!");
      return;
    }
    res.json(items);
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
    const item = await Item.findById(req.params.id);
    if (!item) {
      req.flash("error", "No es pot trobar l'item!");
      return res.redirect("/items");
    }
    res.render("items/edit", { item, localizeBoolean });
  } catch (err) {
    next(err);
  }
};

export const updateItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const item = await Item.findByIdAndUpdate(id, { ...req.body });
    req.flash("success", "Item actualitzat correctament!");
    res.redirect(`/items/${item._id}`);
  } catch (err) {
    next(err);
  }
};

export const deleteItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    await Item.findByIdAndDelete(id);
    req.flash("success", "Item eliminat correctament!");
    res.redirect("/items");
  } catch (err) {
    next(err);
  }
};
