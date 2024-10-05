import { NextFunction, Request, Response } from "express";
import Department from "../models/department";
import { sortByKey } from "../utils/helpers";
import { renderNewForm as _renderNewForm, createItem } from "./helpers";

export const index = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const departments = await Department.find({});
    res.render("departments/index", {
      departments: sortByKey(departments, "nom"),
    });
  } catch (err) {
    next(err);
  }
};

export const renderNewForm = _renderNewForm("departments/new");

export const createDepartment = createItem(Department, "department");

export const showDepartment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user } = req;
    const department = await Department.findById(req.params.id);

    if (!department) {
      req.flash("error", "No es pot trobar el department!");
      return res.redirect("/departments");
    }
    res.render("departments/show", { department, isAdmin: user?.isAdmin });
  } catch (err) {
    next(err);
  }
};

export const getDepartments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const departments = await Department.find();

    if (!departments) {
      req.flash("error", "No es poden trobar departments!");
      return;
    }
    res.json(departments);
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
    const department = await Department.findById(req.params.id);
    if (!department) {
      req.flash("error", "No es pot trobar el department!");
      return res.redirect("/departments");
    }
    res.render("departments/edit", { department });
  } catch (err) {
    next(err);
  }
};

export const updateDepartment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const department = await Department.findByIdAndUpdate(id, {
      ...req.body,
    });
    req.flash("success", "Department actualitzat correctament!");
    res.redirect(`/departments/${department._id}`);
  } catch (err) {
    next(err);
  }
};

export const deleteDepartment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    await Department.findByIdAndDelete(id);
    req.flash("success", "Department eliminat correctament!");
    res.redirect("/departments");
  } catch (err) {
    next(err);
  }
};
