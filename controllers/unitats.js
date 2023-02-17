
const Unitat = require('../models/unitat');
module.exports.index = async (req, res) => {

    const unitats = await Unitat.find({});
    res.render('unitats/index', { unitats })
}

module.exports.renderNewForm = (req, res) => {
    res.render('unitats/new');
}

module.exports.createUnitat = async (req, res, next) => {
    //console.log(req.body)
    let unitatBody = req.body.unitat
    //const albaraArr = JSON.parse(unitatBody.albara)
    unitatBody = { ...unitatBody }
    const unitat = new Unitat(unitatBody);
    unitat.responsable = req.user._id;
    await unitat.save();
    req.flash('success', 'Unitat creada correctament!');
    res.redirect(`/unitats/${unitat._id}`);
}

module.exports.showUnitat =  async (req, res, next) => {
    const unitat = await Unitat.findById(req.params.id).populate('responsable');
    
    if (!unitat) {
        req.flash('error', "No es pot trobar l'unitat!");
        return res.redirect('/unitats');
    }
    res.render('unitats/show', { unitat });
}

module.exports.getUnitats =  async (req, res, next) => {
    const unitats = await Unitat.find()
    
    if (!unitats) {
        req.flash('error', "No es poden trobar unitats!");
        return
    }
    res.json(unitats)
}

module.exports.renderEditForm = async (req, res) => {
    const unitat = await Unitat.findById(req.params.id);
    if (!unitat) {
        req.flash('error', "No es pot trobar l'unitat!");
        return res.redirect('/unitats');
    }
    res.render('unitats/edit', { unitat });
}

module.exports.updateUnitat = async (req, res) => {
    const { id } = req.params;

    const unitat = await Unitat.findByIdAndUpdate(id, { ...req.body.unitat });
    req.flash('success', 'Unitat actualitzat correctament!')
    res.redirect(`/unitats/${unitat._id}`);
}

module.exports.deleteUnitat = async (req, res) => {
    const { id } = req.params;
    await Unitat.findByIdAndDelete(id);
    req.flash('success', 'Unitat eliminat correctament!');
    res.redirect('/unitats');
}

