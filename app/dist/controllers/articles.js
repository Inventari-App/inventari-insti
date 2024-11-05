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
exports.deleteArticle = exports.updateArticle = exports.renderEditForm = exports.showArticle = exports.createArticles = exports.createArticle = exports.renderNewForm = exports.index = void 0;
const article_1 = __importDefault(require("../models/article"));
const department_1 = __importDefault(require("../models/department"));
const unitat_1 = __importDefault(require("../models/unitat"));
const index = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const articles = yield article_1.default.find({})
            .populate({
            path: "responsable",
            populate: { path: "department" },
        })
            .sort({ createdAt: -1 });
        res.render("articles/index", { articles });
    }
    catch (err) {
        next(err);
    }
});
exports.index = index;
const renderNewForm = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const unitats = yield unitat_1.default.find();
        res.render("articles/new", { unitats });
    }
    catch (err) {
        next(err);
    }
});
exports.renderNewForm = renderNewForm;
const createArticle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const articleBody = req.body.article;
        const user = req.currentUser;
        const department = yield department_1.default.findById(user === null || user === void 0 ? void 0 : user.department);
        const article = new article_1.default(Object.assign(Object.assign({}, articleBody), { departament: department }));
        yield article.save();
        req.flash("success", "Article creat correctament!");
        res.redirect("/articles");
    }
    catch (err) {
        next(err);
    }
});
exports.createArticle = createArticle;
const createArticles = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const articles = req.body.articles;
        yield article_1.default.create(articles);
        req.flash("success", "Articles creats correctament!");
        res.status(201);
        next();
    }
    catch (err) {
        next(err);
    }
});
exports.createArticles = createArticles;
const showArticle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { user } = req;
        const article = yield article_1.default.findById(req.params.id).populate("responsable");
        const responsable = article.responsable;
        if (!article) {
            req.flash("error", "No es pot trobar l'article!");
            return res.redirect("/articles");
        }
        res.render("articles/show", {
            article,
            isAdmin: (_a = req.currentUser) === null || _a === void 0 ? void 0 : _a.isAdmin,
            isOwner: responsable && responsable._id.equals(user === null || user === void 0 ? void 0 : user.id),
        });
    }
    catch (err) {
        next(err);
    }
});
exports.showArticle = showArticle;
const renderEditForm = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const article = yield article_1.default.findById(req.params.id);
        const unitats = yield unitat_1.default.find();
        if (!article) {
            req.flash("error", "No es pot trobar l'article!");
            return res.redirect("/articles");
        }
        res.render("articles/edit", { article, unitats });
    }
    catch (err) {
        next(err);
    }
});
exports.renderEditForm = renderEditForm;
const updateArticle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const article = yield article_1.default.findOneAndUpdate({ id }, Object.assign({}, req.body.article), { new: true });
        req.flash("success", "Article actualitzat correctament!");
        res.redirect(`/articles/${article._id}`);
    }
    catch (err) {
        next(err);
    }
});
exports.updateArticle = updateArticle;
const deleteArticle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield article_1.default.findByIdAndDelete(id);
        req.flash("success", "Article eliminat correctament!");
        res.redirect("/articles");
    }
    catch (err) {
        next(err);
    }
});
exports.deleteArticle = deleteArticle;
//# sourceMappingURL=articles.js.map