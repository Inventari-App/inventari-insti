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
exports.deleteUnitat = exports.updateUnitat = exports.renderEditForm = exports.getUnitats = exports.showUnitat = exports.createUnitat = exports.renderNewForm = exports.index = void 0;
const unitat_1 = __importDefault(require("../models/unitat"));
const helpers_1 = require("../utils/helpers");
const helpers_2 = require("./helpers");
const index = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const unitats = yield unitat_1.default.find({});
        res.render("unitats/index", { unitats: (0, helpers_1.sortByKey)(unitats, "nom") });
    }
    catch (err) {
        next(err);
    }
});
exports.index = index;
exports.renderNewForm = (0, helpers_2.renderNewForm)("unitats/new");
exports.createUnitat = (0, helpers_2.createItem)(unitat_1.default, "unitat");
const showUnitat = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req;
        const unitat = yield unitat_1.default.findById(req.params.id).populate("responsable");
        const responsable = unitat.responsable;
        if (!unitat) {
            req.flash("error", "No es pot trobar l'unitat!");
            return res.redirect("/unitats");
        }
        res.render("unitats/show", {
            unitat,
            isAdmin: user === null || user === void 0 ? void 0 : user.isAdmin,
            isOwner: responsable && responsable._id.equals(user === null || user === void 0 ? void 0 : user.id),
        });
    }
    catch (err) {
        next(err);
    }
});
exports.showUnitat = showUnitat;
const getUnitats = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const unitats = yield unitat_1.default.find();
        if (!unitats) {
            req.flash("error", "No es poden trobar unitats!");
            return;
        }
        res.json(unitats);
    }
    catch (err) {
        next(err);
    }
});
exports.getUnitats = getUnitats;
const renderEditForm = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const unitat = yield unitat_1.default.findById(req.params.id);
        if (!unitat) {
            req.flash("error", "No es pot trobar l'unitat!");
            return res.redirect("/unitats");
        }
        res.render("unitats/edit", { unitat });
    }
    catch (err) {
        next(err);
    }
});
exports.renderEditForm = renderEditForm;
const updateUnitat = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const unitat = yield unitat_1.default.findByIdAndUpdate(id, Object.assign({}, req.body));
        req.flash("success", "Unitat actualitzat correctament!");
        res.redirect(`/unitats/${unitat._id}`);
    }
    catch (err) {
        next(err);
    }
});
exports.updateUnitat = updateUnitat;
const deleteUnitat = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield unitat_1.default.findByIdAndDelete(id);
        req.flash("success", "Unitat eliminat correctament!");
        res.redirect("/unitats");
    }
    catch (err) {
        next(err);
    }
});
exports.deleteUnitat = deleteUnitat;
//# sourceMappingURL=unitats.js.map