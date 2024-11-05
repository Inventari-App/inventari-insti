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
exports.deleteArea = exports.updateArea = exports.renderEditForm = exports.getAreas = exports.showArea = exports.createArea = exports.renderNewForm = exports.index = void 0;
const area_1 = __importDefault(require("../models/area"));
const helpers_1 = require("../utils/helpers");
const helpers_2 = require("./helpers");
const index = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const areas = yield area_1.default.find({});
        res.render("areas/index", { areas: (0, helpers_1.sortByKey)(areas, "nom") });
    }
    catch (err) {
        next(err);
    }
});
exports.index = index;
exports.renderNewForm = (0, helpers_2.renderNewForm)("areas/new");
exports.createArea = (0, helpers_2.createItem)(area_1.default, "area");
const showArea = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.currentUser;
        const area = yield area_1.default.findById(req.params.id).populate("responsable");
        if (!area) {
            req.flash("error", "No es pot trobar la area!");
            return res.redirect("/areas");
        }
        res.render("areas/show", { area, isAdmin: user === null || user === void 0 ? void 0 : user.isAdmin });
    }
    catch (err) {
        next(err);
    }
});
exports.showArea = showArea;
const getAreas = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const areas = yield area_1.default.find();
        if (!areas) {
            req.flash("error", "No es poden trobar zones!");
            return;
        }
        res.json(areas);
    }
    catch (err) {
        next(err);
    }
});
exports.getAreas = getAreas;
const renderEditForm = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const area = yield area_1.default.findById(req.params.id);
        if (!area) {
            req.flash("error", "No es pot trobar la area!");
            return res.redirect("/areas");
        }
        res.render("areas/edit", { area });
    }
    catch (err) {
        next(err);
    }
});
exports.renderEditForm = renderEditForm;
const updateArea = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const area = yield area_1.default.findByIdAndUpdate(id, Object.assign({}, req.body));
        req.flash("success", "Area actualitzada correctament!");
        res.redirect(`/areas/${area._id}`);
    }
    catch (err) {
        next(err);
    }
});
exports.updateArea = updateArea;
const deleteArea = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield area_1.default.findByIdAndDelete(id);
        req.flash("success", "Area eliminada correctament!");
        res.redirect("/areas");
    }
    catch (err) {
        next(err);
    }
});
exports.deleteArea = deleteArea;
//# sourceMappingURL=areas.js.map