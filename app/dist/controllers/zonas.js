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
exports.deleteZona = exports.updateZona = exports.renderEditForm = exports.getZonas = exports.showZona = exports.createZona = exports.renderNewForm = exports.index = void 0;
const zona_1 = __importDefault(require("../models/zona"));
const helpers_1 = require("../utils/helpers");
const helpers_2 = require("./helpers");
const index = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const zonas = yield zona_1.default.find({});
        res.render("zonas/index", { zonas: (0, helpers_1.sortByKey)(zonas, "nom") });
    }
    catch (err) {
        next(err);
    }
});
exports.index = index;
exports.renderNewForm = (0, helpers_2.renderNewForm)("zonas/new");
exports.createZona = (0, helpers_2.createItem)(zona_1.default, "zona");
const showZona = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.currentUser;
        const zona = yield zona_1.default.findById(req.params.id).populate("responsable");
        if (!zona) {
            req.flash("error", "No es pot trobar la zona!");
            return res.redirect("/zonas");
        }
        res.render("zonas/show", { zona, isAdmin: user === null || user === void 0 ? void 0 : user.isAdmin });
    }
    catch (err) {
        next(err);
    }
});
exports.showZona = showZona;
const getZonas = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const zonas = yield zona_1.default.find();
        if (!zonas) {
            req.flash("error", "No es poden trobar zones!");
            return;
        }
        res.json(zonas);
    }
    catch (err) {
        next(err);
    }
});
exports.getZonas = getZonas;
const renderEditForm = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const zona = yield zona_1.default.findById(req.params.id);
        if (!zona) {
            req.flash("error", "No es pot trobar la zona!");
            return res.redirect("/zonas");
        }
        res.render("zonas/edit", { zona });
    }
    catch (err) {
        next(err);
    }
});
exports.renderEditForm = renderEditForm;
const updateZona = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const zona = yield zona_1.default.findByIdAndUpdate(id, Object.assign({}, req.body));
        req.flash("success", "Zona actualitzada correctament!");
        res.redirect(`/zonas/${zona._id}`);
    }
    catch (err) {
        next(err);
    }
});
exports.updateZona = updateZona;
const deleteZona = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield zona_1.default.findByIdAndDelete(id);
        req.flash("success", "Zona eliminada correctament!");
        res.redirect("/zonas");
    }
    catch (err) {
        next(err);
    }
});
exports.deleteZona = deleteZona;
//# sourceMappingURL=zonas.js.map