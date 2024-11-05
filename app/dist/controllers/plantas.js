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
exports.deletePlanta = exports.updatePlanta = exports.renderEditForm = exports.getPlantas = exports.showPlanta = exports.createPlanta = exports.renderNewForm = exports.index = void 0;
const planta_1 = __importDefault(require("../models/planta"));
const helpers_1 = require("../utils/helpers");
const helpers_2 = require("./helpers");
const index = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const plantas = yield planta_1.default.find({});
        res.render("plantas/index", { plantas: (0, helpers_1.sortByKey)(plantas, "nom") });
    }
    catch (err) {
        next(err);
    }
});
exports.index = index;
exports.renderNewForm = (0, helpers_2.renderNewForm)("plantas/new");
exports.createPlanta = (0, helpers_2.createItem)(planta_1.default, "planta");
const showPlanta = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.currentUser;
        const planta = yield planta_1.default.findById(req.params.id).populate("responsable");
        if (!planta) {
            req.flash("error", "No es pot trobar la planta!");
            return res.redirect("/plantas");
        }
        res.render("plantas/show", { planta, isAdmin: user === null || user === void 0 ? void 0 : user.isAdmin });
    }
    catch (err) {
        next(err);
    }
});
exports.showPlanta = showPlanta;
const getPlantas = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const plantas = yield planta_1.default.find();
        if (!plantas) {
            req.flash("error", "No es poden trobar zones!");
            return;
        }
        res.json(plantas);
    }
    catch (err) {
        next(err);
    }
});
exports.getPlantas = getPlantas;
const renderEditForm = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const planta = yield planta_1.default.findById(req.params.id);
        if (!planta) {
            req.flash("error", "No es pot trobar la planta!");
            return res.redirect("/plantas");
        }
        res.render("plantas/edit", { planta });
    }
    catch (err) {
        next(err);
    }
});
exports.renderEditForm = renderEditForm;
const updatePlanta = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const planta = yield planta_1.default.findByIdAndUpdate(id, Object.assign({}, req.body));
        req.flash("success", "Planta actualitzada correctament!");
        res.redirect(`/plantas/${planta._id}`);
    }
    catch (err) {
        next(err);
    }
});
exports.updatePlanta = updatePlanta;
const deletePlanta = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield planta_1.default.findByIdAndDelete(id);
        req.flash("success", "Planta eliminada correctament!");
        res.redirect("/plantas");
    }
    catch (err) {
        next(err);
    }
});
exports.deletePlanta = deletePlanta;
//# sourceMappingURL=plantas.js.map