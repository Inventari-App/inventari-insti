var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Area from "../models/area";
import { sortByKey } from "../utils/helpers";
import { renderNewForm as _renderNewForm, createItem } from "./helpers";
export const index = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const areas = yield Area.find({});
        res.render("areas/index", { areas: sortByKey(areas, "nom") });
    }
    catch (err) {
        next(err);
    }
});
export const renderNewForm = _renderNewForm("areas/new");
export const createArea = createItem(Area, "area");
export const showArea = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const area = yield Area.findById(req.params.id).populate("responsable");
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
export const getAreas = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const areas = yield Area.find();
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
export const renderEditForm = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const area = yield Area.findById(req.params.id);
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
export const updateArea = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const area = yield Area.findByIdAndUpdate(id, Object.assign({}, req.body));
        req.flash("success", "Area actualitzada correctament!");
        res.redirect(`/areas/${area._id}`);
    }
    catch (err) {
        next(err);
    }
});
export const deleteArea = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield Area.findByIdAndDelete(id);
        req.flash("success", "Area eliminada correctament!");
        res.redirect("/areas");
    }
    catch (err) {
        next(err);
    }
});
