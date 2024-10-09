var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Item from "../models/item";
import { localizeBoolean } from "../utils/helpers";
import { renderNewForm as _renderNewForm, createItem as _createItem, } from "./helpers";
export const index = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield Item.find({}).populate("responsable");
        res.render("items/index", { items, localizeBoolean });
    }
    catch (err) {
        next(err);
    }
});
export const renderNewForm = _renderNewForm("items/new");
export const createItem = _createItem(Item, "item");
export const showItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req;
        const item = yield Item.findById(req.params.id).populate("responsable");
        const responsable = item.responsable;
        if (!item) {
            req.flash("error", "No es pot trobar l'item!");
            return res.redirect("/items");
        }
        res.render("items/show", {
            item,
            isAdmin: user === null || user === void 0 ? void 0 : user.isAdmin,
            isOwner: responsable && responsable._id.equals(user === null || user === void 0 ? void 0 : user.id),
            localizeBoolean,
        });
    }
    catch (err) {
        next(err);
    }
});
export const getItems = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield Item.find().populate("responsable");
        if (!items) {
            req.flash("error", "No es poden trobar items!");
            return;
        }
        res.json(items);
    }
    catch (err) {
        next(err);
    }
});
export const renderEditForm = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield Item.findById(req.params.id);
        if (!item) {
            req.flash("error", "No es pot trobar l'item!");
            return res.redirect("/items");
        }
        res.render("items/edit", { item, localizeBoolean });
    }
    catch (err) {
        next(err);
    }
});
export const updateItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const item = yield Item.findByIdAndUpdate(id, Object.assign({}, req.body));
        req.flash("success", "Item actualitzat correctament!");
        res.redirect(`/items/${item._id}`);
    }
    catch (err) {
        next(err);
    }
});
export const deleteItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield Item.findByIdAndDelete(id);
        req.flash("success", "Item eliminat correctament!");
        res.redirect("/items");
    }
    catch (err) {
        next(err);
    }
});
