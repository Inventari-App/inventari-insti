var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Proveidor from "../models/proveidor";
import { sortByKey } from "../utils/helpers";
import { renderNewForm as _renderNewForm, createItem } from "./helpers";
export const index = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const proveidors = yield Proveidor.find({});
        res.render("proveidors/index", {
            proveidors: sortByKey(proveidors, "nom"),
        });
    }
    catch (err) {
        next(err);
    }
});
export const renderNewForm = _renderNewForm("proveidors/new");
export const createProveidor = createItem(Proveidor, "proveidor");
export const showProveidor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const proveidor = yield Proveidor.findById(req.params.id).populate("responsable");
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
export const getProveidors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const proveidors = yield Proveidor.find();
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
export const renderEditForm = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const proveidor = yield Proveidor.findById(req.params.id);
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
export const updateProveidor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const proveidor = yield Proveidor.findByIdAndUpdate(id, Object.assign({}, req.body));
        req.flash("success", "Proveidor actualitzat correctament!");
        res.redirect(`/proveidors/${proveidor._id}`);
    }
    catch (err) {
        next(err);
    }
});
export const deleteProveidor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield Proveidor.findByIdAndDelete(id);
        req.flash("success", "Proveidor eliminat correctament!");
        res.redirect("/proveidors");
    }
    catch (err) {
        next(err);
    }
});
