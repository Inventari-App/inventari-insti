const Department = require("../models/department");

module.exports.index = async (req, res, next) => {
  try {
    const departments = await Department.find({});
    res.render("departments/index", { departments });
  } catch (err) {
    next(err);
  }
};

module.exports.renderNewForm = (req, res, next) => {
  try {
    res.render("departments/new");
  } catch (err) {
    next(err);
  }
};

module.exports.createDepartment = async (req, res, next) => {
  try {
    let departmentBody = req.body.department;
    const department = new Department({ ...departmentBody });
    await department.save();
    req.flash("success", "Department creat correctament!");
    res.status(201).json(department);
  } catch (err) {
    next(err);
  }
};

module.exports.showDepartment = async (req, res, next) => {
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

module.exports.getDepartments = async (req, res, next) => {
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

module.exports.renderEditForm = async (req, res, next) => {
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

module.exports.updateDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const department = await Department.findByIdAndUpdate(id, {
      ...req.body.department,
    });
    req.flash("success", "Department actualitzat correctament!");
    res.redirect(`/departments/${department._id}`);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Department.findByIdAndDelete(id);
    req.flash("success", "Department eliminat correctament!");
    res.redirect("/departments");
  } catch (err) {
    next(err);
  }
};
