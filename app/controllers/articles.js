const article = require("../models/article");
const Article = require("../models/article");
const Department = require("../models/department");
const Unitat = require("../models/unitat");

module.exports.index = async (req, res) => {
  const articles = await Article.find({})
    .populate({
      path: "responsable",
      populate: { path: "department" },
    })
    .sort({ createdAt: -1 });

  res.render("articles/index", { articles });
};

module.exports.renderNewForm = async (req, res) => {
  const unitats = await Unitat.find();
  res.render("articles/new", { unitats });
};

module.exports.createArticle = async (req, res, next) => {
  try {
    let articleBody = req.body.article;
    const user = req.user
    const department = await Department.findById(user.department)
    const article = new Article({ ...articleBody, departament: department });
    await article.save();
    req.flash("success", "Article creat correctament!");
    res.redirect("/articles");
  } catch (error) {
    req.flash("error", "Alguna cosa no ha anat be al crear l'article.");
    res.redirect("/articles");
  }
};

module.exports.createArticles = async (req, res, next) => {
  try {
    const articles = req.body.articles;
    await Article.create(articles);
    req.flash("success", "Articles creats correctament!");
    res.status(201)
  } catch (error) {
    req.flash("error", "Alguna cosa no ha anat be al crear els articles.");
    res.status(400)
  }
  next()
};

module.exports.showArticle = async (req, res, next) => {
  const { user } = req;
  const article = await Article.findById(req.params.id).populate("responsable");
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
};

module.exports.renderEditForm = async (req, res) => {
  const article = await Article.findById(req.params.id);
  const unitats = await Unitat.find();

  if (!article) {
    req.flash("error", "No es pot trobar l'article!");
    return res.redirect("/articles");
  }
  res.render("articles/edit", { article, unitats });
};

module.exports.updateArticle = async (req, res) => {
  const { id } = req.params;

  const article = await Article.findByIdAndUpdate(id, { ...req.body.article });
  req.flash("success", "Article actualitzat correctament!");
  res.redirect(`/articles/${article._id}`);
};

module.exports.deleteArticle = async (req, res) => {
  const { id } = req.params;
  await Article.findByIdAndDelete(id);
  req.flash("success", "Article eliminat correctament!");
  res.redirect("/articles");
};
