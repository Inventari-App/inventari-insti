var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Article from "../models/article";
import Department from "../models/department";
import Unitat from "../models/unitat";
export const index = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const articles = yield Article.find({})
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
export const renderNewForm = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const unitats = yield Unitat.find();
        res.render("articles/new", { unitats });
    }
    catch (err) {
        next(err);
    }
});
export const createArticle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const articleBody = req.body.article;
        const user = req.user;
        const department = yield Department.findById(user === null || user === void 0 ? void 0 : user.department);
        const article = new Article(Object.assign(Object.assign({}, articleBody), { departament: department }));
        yield article.save();
        req.flash("success", "Article creat correctament!");
        res.redirect("/articles");
    }
    catch (err) {
        next(err);
    }
});
export const createArticles = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const articles = req.body.articles;
        yield Article.create(articles);
        req.flash("success", "Articles creats correctament!");
        res.status(201);
        next();
    }
    catch (err) {
        next(err);
    }
});
export const showArticle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { user } = req;
        const article = yield Article.findById(req.params.id).populate("responsable");
        const responsable = article.responsable;
        if (!article) {
            req.flash("error", "No es pot trobar l'article!");
            return res.redirect("/articles");
        }
        res.render("articles/show", {
            article,
            isAdmin: (_a = req.user) === null || _a === void 0 ? void 0 : _a.isAdmin,
            isOwner: responsable && responsable._id.equals(user === null || user === void 0 ? void 0 : user.id),
        });
    }
    catch (err) {
        next(err);
    }
});
export const renderEditForm = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const article = yield Article.findById(req.params.id);
        const unitats = yield Unitat.find();
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
export const updateArticle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const article = yield Article.findOneAndUpdate({ id }, Object.assign({}, req.body.article), { new: true });
        req.flash("success", "Article actualitzat correctament!");
        res.redirect(`/articles/${article._id}`);
    }
    catch (err) {
        next(err);
    }
});
export const deleteArticle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield Article.findByIdAndDelete(id);
        req.flash("success", "Article eliminat correctament!");
        res.redirect("/articles");
    }
    catch (err) {
        next(err);
    }
});
