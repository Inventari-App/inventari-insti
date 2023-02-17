
const utilitat = require('../models/utilitat');
module.exports.index = async (req, res) => {

    const utilitats = await utilitat.find({});
    res.render('utilitats/index', { utilitats })
}

module.exports.renderNewForm = (req, res) => {
    res.render('utilitats/new');
}

module.exports.createutilitat = async (req, res, next) => {
    //console.log(req.body)
    let utilitatBody = req.body.utilitat
    //const albaraArr = JSON.parse(utilitatBody.albara)
    utilitatBody = { ...utilitatBody }
    const utilitat = new utilitat(utilitatBody);
    utilitat.responsable = req.user._id;
    await utilitat.save();
    req.flash('success', 'Àrea creada correctament!');
    res.redirect(`/utilitats/${utilitat._id}`);
}

module.exports.showutilitat =  async (req, res, next) => {
    const utilitat = await utilitat.findById(req.params.id).populate('responsable');
    
    if (!utilitat) {
        req.flash('error', "No es pot trobar l'utilitat!");
        return res.redirect('/utilitats');
    }
    res.render('utilitats/show', { utilitat });
}

module.exports.renderEditForm = async (req, res) => {
    const utilitat = await utilitat.findById(req.params.id);
    if (!utilitat) {
        req.flash('error', "No es pot trobar l'àrea!");
        return res.redirect('/utilitats');
    }
    res.render('utilitats/edit', { utilitat });
}

module.exports.updateutilitat = async (req, res) => {
    const { id } = req.params;

    const utilitat = await utilitat.findByIdAndUpdate(id, { ...req.body.utilitat });
    req.flash('success', 'utilitat actualitzat correctament!')
    res.redirect(`/utilitats/${utilitat._id}`);
}

module.exports.deleteutilitat = async (req, res) => {
    const { id } = req.params;
    await utilitat.findByIdAndDelete(id);
    req.flash('success', 'utilitat eliminat correctament!');
    res.redirect('/utilitats');
}

