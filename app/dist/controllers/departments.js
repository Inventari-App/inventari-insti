var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Department from "../models/department";
import { sortByKey } from "../utils/helpers";
import { renderNewForm as _renderNewForm, createItem } from "./helpers";
export const index = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const departments = yield Department.find({});
        res.render("departments/index", {
            departments: sortByKey(departments, "nom"),
        });
    }
    catch (err) {
        next(err);
    }
});
export const renderNewForm = _renderNewForm("departments/new");
export const createDepartment = createItem(Department, "department");
export const showDepartment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req;
        const department = yield Department.findById(req.params.id);
        if (!department) {
            req.flash("error", "No es pot trobar el department!");
            return res.redirect("/departments");
        }
        res.render("departments/show", { department, isAdmin: user === null || user === void 0 ? void 0 : user.isAdmin });
    }
    catch (err) {
        next(err);
    }
});
export const getDepartments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const departments = yield Department.find();
        if (!departments) {
            req.flash("error", "No es poden trobar departments!");
            return;
        }
        res.json(departments);
    }
    catch (err) {
        next(err);
    }
});
export const renderEditForm = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const department = yield Department.findById(req.params.id);
        if (!department) {
            req.flash("error", "No es pot trobar el department!");
            return res.redirect("/departments");
        }
        res.render("departments/edit", { department });
    }
    catch (err) {
        next(err);
    }
});
export const updateDepartment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const department = yield Department.findByIdAndUpdate(id, Object.assign({}, req.body));
        req.flash("success", "Department actualitzat correctament!");
        res.redirect(`/departments/${department._id}`);
    }
    catch (err) {
        next(err);
    }
});
export const deleteDepartment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield Department.findByIdAndDelete(id);
        req.flash("success", "Department eliminat correctament!");
        res.redirect("/departments");
    }
    catch (err) {
        next(err);
    }
});
