var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Unitat from "../models/unitat";
import { sortByKey } from "../utils/helpers";
import { renderNewForm as _renderNewForm, createItem as _createItem, } from "./helpers";
export const index = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const unitats = yield Unitat.find({});
        res.render("unitats/index", { unitats: sortByKey(unitats, "nom") });
    }
    catch (err) {
        next(err);
    }
});
export const renderNewForm = _renderNewForm("unitats/new");
export const createUnitat = _createItem(Unitat, "unitat");
export const showUnitat = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req;
        const unitat = yield Unitat.findById(req.params.id).populate("responsable");
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
export const getUnitats = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const unitats = yield Unitat.find();
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
export const renderEditForm = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const unitat = yield Unitat.findById(req.params.id);
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
export const updateUnitat = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const unitat = yield Unitat.findByIdAndUpdate(id, Object.assign({}, req.body));
        req.flash("success", "Unitat actualitzat correctament!");
        res.redirect(`/unitats/${unitat._id}`);
    }
    catch (err) {
        next(err);
    }
});
export const deleteUnitat = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield Unitat.findByIdAndDelete(id);
        req.flash("success", "Unitat eliminat correctament!");
        res.redirect("/unitats");
    }
    catch (err) {
        next(err);
    }
});
