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
exports.deleteItem = exports.updateItem = exports.renderEditForm = exports.getItems = exports.showItem = exports.createItem = exports.renderNewForm = exports.index = void 0;
const item_1 = __importDefault(require("../models/item"));
const helpers_1 = require("../utils/helpers");
const helpers_2 = require("./helpers");
const index = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield item_1.default.find({}).populate("responsable");
        res.render("items/index", { items, localizeBoolean: helpers_1.localizeBoolean });
    }
    catch (err) {
        next(err);
    }
});
exports.index = index;
exports.renderNewForm = (0, helpers_2.renderNewForm)("items/new");
exports.createItem = (0, helpers_2.createItem)(item_1.default, "item");
const showItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req;
        const item = yield item_1.default.findById(req.params.id).populate("responsable");
        const responsable = item.responsable;
        if (!item) {
            req.flash("error", "No es pot trobar l'item!");
            return res.redirect("/items");
        }
        res.render("items/show", {
            item,
            isAdmin: user === null || user === void 0 ? void 0 : user.isAdmin,
            isOwner: responsable && responsable._id.equals(user === null || user === void 0 ? void 0 : user.id),
            localizeBoolean: helpers_1.localizeBoolean,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.showItem = showItem;
const getItems = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield item_1.default.find().populate("responsable");
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
exports.getItems = getItems;
const renderEditForm = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield item_1.default.findById(req.params.id);
        if (!item) {
            req.flash("error", "No es pot trobar l'item!");
            return res.redirect("/items");
        }
        res.render("items/edit", { item, localizeBoolean: helpers_1.localizeBoolean });
    }
    catch (err) {
        next(err);
    }
});
exports.renderEditForm = renderEditForm;
const updateItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const item = yield item_1.default.findByIdAndUpdate(id, Object.assign({}, req.body));
        req.flash("success", "Item actualitzat correctament!");
        res.redirect(`/items/${item._id}`);
    }
    catch (err) {
        next(err);
    }
});
exports.updateItem = updateItem;
const deleteItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield item_1.default.findByIdAndDelete(id);
        req.flash("success", "Item eliminat correctament!");
        res.redirect("/items");
    }
    catch (err) {
        next(err);
    }
});
exports.deleteItem = deleteItem;
//# sourceMappingURL=items.js.map