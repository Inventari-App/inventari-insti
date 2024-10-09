var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Zona from "../models/zona";
import { sortByKey } from "../utils/helpers";
import { renderNewForm as _renderNewForm, createItem as _createItem, } from "./helpers";
export const index = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const zonas = yield Zona.find({});
        res.render("zonas/index", { zonas: sortByKey(zonas, "nom") });
    }
    catch (err) {
        next(err);
    }
});
export const renderNewForm = _renderNewForm("zonas/new");
export const createZona = _createItem(Zona, "zona");
export const showZona = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const zona = yield Zona.findById(req.params.id).populate("responsable");
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
export const getZonas = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const zonas = yield Zona.find();
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
export const renderEditForm = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const zona = yield Zona.findById(req.params.id);
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
export const updateZona = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const zona = yield Zona.findByIdAndUpdate(id, Object.assign({}, req.body));
        req.flash("success", "Zona actualitzada correctament!");
        res.redirect(`/zonas/${zona._id}`);
    }
    catch (err) {
        next(err);
    }
});
export const deleteZona = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield Zona.findByIdAndDelete(id);
        req.flash("success", "Zona eliminada correctament!");
        res.redirect("/zonas");
    }
    catch (err) {
        next(err);
    }
});
