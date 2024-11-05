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
exports.deleteProveidor = exports.updateProveidor = exports.renderEditForm = exports.getProveidors = exports.showProveidor = exports.createProveidor = exports.renderNewForm = exports.index = void 0;
const proveidor_1 = __importDefault(require("../models/proveidor"));
const helpers_1 = require("../utils/helpers");
const helpers_2 = require("./helpers");
const index = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const proveidors = yield proveidor_1.default.find({});
        res.render("proveidors/index", {
            proveidors: (0, helpers_1.sortByKey)(proveidors, "nom"),
        });
    }
    catch (err) {
        next(err);
    }
});
exports.index = index;
exports.renderNewForm = (0, helpers_2.renderNewForm)("proveidors/new");
exports.createProveidor = (0, helpers_2.createItem)(proveidor_1.default, "proveidor");
const showProveidor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.currentUser;
        const proveidor = yield proveidor_1.default.findById(req.params.id).populate("responsable");
        if (!proveidor) {
            req.flash("error", "No es pot trobar el proveidor!");
            return res.redirect("/proveidors");
        }
        res.render("proveidors/show", { proveidor, isAdmin: user === null || user === void 0 ? void 0 : user.isAdmin });
    }
    catch (err) {
        next(err);
    }
});
exports.showProveidor = showProveidor;
const getProveidors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const proveidors = yield proveidor_1.default.find();
        if (!proveidors) {
            req.flash("error", "No es poden trobar proveidors!");
            return;
        }
        res.json(proveidors);
    }
    catch (err) {
        next(err);
    }
});
exports.getProveidors = getProveidors;
const renderEditForm = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const proveidor = yield proveidor_1.default.findById(req.params.id);
        if (!proveidor) {
            req.flash("error", "No es pot trobar el proveidor!");
            return res.redirect("/proveidors");
        }
        res.render("proveidors/edit", { proveidor });
    }
    catch (err) {
        next(err);
    }
});
exports.renderEditForm = renderEditForm;
const updateProveidor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const proveidor = yield proveidor_1.default.findByIdAndUpdate(id, Object.assign({}, req.body));
        req.flash("success", "Proveidor actualitzat correctament!");
        res.redirect(`/proveidors/${proveidor._id}`);
    }
    catch (err) {
        next(err);
    }
});
exports.updateProveidor = updateProveidor;
const deleteProveidor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield proveidor_1.default.findByIdAndDelete(id);
        req.flash("success", "Proveidor eliminat correctament!");
        res.redirect("/proveidors");
    }
    catch (err) {
        next(err);
    }
});
exports.deleteProveidor = deleteProveidor;
//# sourceMappingURL=proveidors.js.map