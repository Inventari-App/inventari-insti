const Article = require('../models/article');
module.exports.index = async (req, res) => {

    const articles = await Article.find({});
    res.render('articles/index', { articles })
}

module.exports.renderNewForm = (req, res) => {
    res.render('articles/new');
}

module.exports.createArticle = async (req, res, next) => {
    //console.log(req.body)
    let articleBody = req.body.article
    //const albaraArr = JSON.parse(articleBody.albara)
    articleBody = { ...articleBody }
    const article = new Article(articleBody);
    article.responsable = req.user._id;
    await article.save();
    req.flash('success', 'Article creat correctament!');
    res.redirect(`/articles/${article._id}`);
}

module.exports.showArticle =  async (req, res, next) => {
    const article = await Article.findById(req.params.id).populate('responsable');
    
    if (!article) {
        req.flash('error', "No es pot trobar l'article!");
        return res.redirect('/articles');
    }
    res.render('articles/show', { article });
}

module.exports.renderEditForm = async (req, res) => {
    const article = await Article.findById(req.params.id);
    if (!article) {
        req.flash('error', "No es pot trobar l'article!");
        return res.redirect('/articles');
    }
    res.render('articles/edit', { article });
}

module.exports.updateArticle = async (req, res) => {
    const { id } = req.params;

    const article = await Article.findByIdAndUpdate(id, { ...req.body.article });
    req.flash('success', 'Article actualitzat correctament!')
    res.redirect(`/articles/${article._id}`);
}

module.exports.deleteArticle = async (req, res) => {
    const { id } = req.params;
    await Article.findByIdAndDelete(id);
    req.flash('success', 'Article eliminat correctament!');
    res.redirect('/articles');
}

