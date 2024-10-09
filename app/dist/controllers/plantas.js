var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Planta from "../models/planta";
import { sortByKey } from "../utils/helpers";
import { renderNewForm as _renderNewForm, createItem as _createItem, } from "./helpers";
export const index = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const plantas = yield Planta.find({});
        res.render("plantas/index", { plantas: sortByKey(plantas, "nom") });
    }
    catch (err) {
        next(err);
    }
});
export const renderNewForm = _renderNewForm("plantas/new");
export const createPlanta = _createItem(Planta, "planta");
export const showPlanta = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const planta = yield Planta.findById(req.params.id).populate("responsable");
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
export const getPlantas = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const plantas = yield Planta.find();
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
export const renderEditForm = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const planta = yield Planta.findById(req.params.id);
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
export const updatePlanta = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const planta = yield Planta.findByIdAndUpdate(id, Object.assign({}, req.body));
        req.flash("success", "Planta actualitzada correctament!");
        res.redirect(`/plantas/${planta._id}`);
    }
    catch (err) {
        next(err);
    }
});
export const deletePlanta = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield Planta.findByIdAndDelete(id);
        req.flash("success", "Planta eliminada correctament!");
        res.redirect("/plantas");
    }
    catch (err) {
        next(err);
    }
});
