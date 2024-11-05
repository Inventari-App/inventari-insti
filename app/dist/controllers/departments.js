"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDepartment = exports.updateDepartment = exports.renderEditForm = exports.getDepartments = exports.showDepartment = exports.createDepartment = exports.renderNewForm = exports.index = void 0;
const department_1 = __importDefault(require("../models/department"));
const helpers_1 = require("../utils/helpers");
const helpers_2 = require("./helpers");
const index = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const departments = yield department_1.default.find({});
        res.render("departments/index", {
            departments: (0, helpers_1.sortByKey)(departments, "nom"),
        });
    }
    catch (err) {
        next(err);
    }
});
exports.index = index;
exports.renderNewForm = (0, helpers_2.renderNewForm)("departments/new");
exports.createDepartment = (0, helpers_2.createItem)(department_1.default, "department");
const showDepartment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req;
        const department = yield department_1.default.findById(req.params.id);
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
exports.showDepartment = showDepartment;
const getDepartments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const departments = yield department_1.default.find();
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
exports.getDepartments = getDepartments;
const renderEditForm = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const department = yield department_1.default.findById(req.params.id);
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
exports.renderEditForm = renderEditForm;
const updateDepartment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const department = yield department_1.default.findByIdAndUpdate(id, Object.assign({}, req.body));
        req.flash("success", "Department actualitzat correctament!");
        res.redirect(`/departments/${department._id}`);
    }
    catch (err) {
        next(err);
    }
});
exports.updateDepartment = updateDepartment;
const deleteDepartment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield department_1.default.findByIdAndDelete(id);
        req.flash("success", "Department eliminat correctament!");
        res.redirect("/departments");
    }
    catch (err) {
        next(err);
    }
});
exports.deleteDepartment = deleteDepartment;
//# sourceMappingURL=departments.js.map