const Article = require("../models/article");

module.exports.index = async (req, res) => {
  const articles = await Article
    .find({})
    .populate('responsable')
    .sort({ createdAt: -1 });

  res.render("articles/index", { articles });
};

module.exports.renderNewForm = (req, res) => {
  res.render("articles/new");
};

module.exports.createArticle = async (req, res, next) => {
  try {
    let articleBody = req.body.article;
    const article = new Article(articleBody);
    await article.save();
    req.flash("success", "Article creat correctament!");
    res.sendStatus(200)
  } catch (error) {
    console.error(error)
    res.sendStatus(400)
  }
};

module.exports.showArticle = async (req, res, next) => {
  const article = await Article.findById(req.params.id).populate("responsable");

  if (!article) {
    req.flash("error", "No es pot trobar l'article!");
    return res.redirect("/articles");
  }
  res.render("articles/show", { article, isAdmin: req.user.isAdmin });
};

module.exports.renderEditForm = async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) {
    req.flash("error", "No es pot trobar l'article!");
    return res.redirect("/articles");
  }
  res.render("articles/edit", { article });
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
