import Article from "../models/article";
import Department from "../models/department";
import Unitat from "../models/unitat";

export const index = async (req, res, next) => {
  try {
    const articles = await Article.find({})
      .populate({
        path: "responsable",
        populate: { path: "department" },
      })
      .sort({ createdAt: -1 });

    res.render("articles/index", { articles });
  } catch (err) {
    next(err);
  }
};

export const renderNewForm = async (req, res, next) => {
  try {
    const unitats = await Unitat.find();
    res.render("articles/new", { unitats });
  } catch (err) {
    next(err);
  }
};

export const createArticle = async (req, res, next) => {
  try {
    let articleBody = req.body.article;
    const user = req.user;
    const department = await Department.findById(user.department);
    const article = new Article({
      ...articleBody,
      departament: department,
    });
    await article.save();
    req.flash("success", "Article creat correctament!");
    res.redirect("/articles");
  } catch (err) {
    next(err);
  }
};

export const createArticles = async (req, res, next) => {
  try {
    const articles = req.body.articles;
    await Article.create(articles);
    req.flash("success", "Articles creats correctament!");
    res.status(201);
    next();
  } catch (err) {
    next(err);
  }
};

export const showArticle = async (req, res, next) => {
  try {
    const { user } = req;
    const article = await Article.findById(req.params.id).populate(
      "responsable",
    );
    const responsable = article.responsable;

    if (!article) {
      req.flash("error", "No es pot trobar l'article!");
      return res.redirect("/articles");
    }

    res.render("articles/show", {
      article,
      isAdmin: req.user.isAdmin,
      isOwner: responsable && responsable._id.equals(user.id),
    });
  } catch (err) {
    next(err);
  }
};

export const renderEditForm = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    const unitats = await Unitat.find();

    if (!article) {
      req.flash("error", "No es pot trobar l'article!");
      return res.redirect("/articles");
    }
    res.render("articles/edit", { article, unitats });
  } catch (err) {
    next(err);
  }
};

export const updateArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const article = await Article.findOneAndUpdate(
      { id },
      { ...req.body.article },
      { new: true }
    );
    req.flash("success", "Article actualitzat correctament!");
    res.redirect(`/articles/${article._id}`);
  } catch (err) {
    next(err);
  }
};

export const deleteArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Article.findByIdAndDelete(id);
    req.flash("success", "Article eliminat correctament!");
    res.redirect("/articles");
  } catch (err) {
    next(err);
  }
};

