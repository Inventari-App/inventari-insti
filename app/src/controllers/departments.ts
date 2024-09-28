import Department from "../models/department";
import { sortByKey } from "../utils/helpers";
import { renderNewForm, createItem } from "./helpers";

export const index = async (req, res, next) => {
  try {
    const departments = await Department.find({});
    res.render("departments/index", { departments: sortByKey(departments, "nom") });
  } catch (err) {
    next(err);
  }
};

export const renderNewForm = renderNewForm("departments/new");

export const createDepartment = createItem(Department, 'department', (req, res, err) => {
  if (err.code == 11000) {
    req.flash("error", "Un departament amb el mateix nom ja existeix.");
    return res.redirect(`/departments/new${req.query.tab ? "?tab=true" : ""}`);
  }
  next(err);
});

export const showDepartment = async (req, res, next) => {
  try {
    const { user } = req;
    const department = await Department.findById(req.params.id);

    if (!department) {
      req.flash("error", "No es pot trobar el department!");
      return res.redirect("/departments");
    }
    res.render("departments/show", { department, isAdmin: user.isAdmin });
  } catch (err) {
    next(err);
  }
};

export const getDepartments = async (req, res, next) => {
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

export const renderEditForm = async (req, res, next) => {
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

export const updateDepartment = async (req, res, next) => {
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

export const deleteDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Department.findByIdAndDelete(id);
    req.flash("success", "Department eliminat correctament!");
    res.redirect("/departments");
  } catch (err) {
    next(err);
  }
};

