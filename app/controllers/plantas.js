
const Planta = require('../models/planta');
module.exports.index = async (req, res) => {

    const plantas = await Planta.find({});
    res.render('plantas/index', { plantas })
}

module.exports.renderNewForm = (req, res) => {
    res.render('plantas/new');
}

module.exports.createPlanta = async (req, res, next) => {
    //console.log(req.body)
    let plantaBody = req.body.planta
    //const albaraArr = JSON.parse(plantaBody.albara)
    plantaBody = { ...plantaBody }
    const planta = new Planta(plantaBody);
    planta.responsable = req.user._id;
    await planta.save();
    req.flash('success', 'Planta creada correctament!');
    res.redirect(`/plantas/${planta._id}`);
}

module.exports.showPlanta =  async (req, res, next) => {
    const planta = await Planta.findById(req.params.id).populate('responsable');
    
    if (!planta) {
        req.flash('error', "No es pot trobar la planta!");
        return res.redirect('/plantas');
    }
    res.render('plantas/show', { planta });
}

module.exports.getPlantas =  async (req, res, next) => {
    const plantas = await Planta.find()
    
    if (!plantas) {
        req.flash('error', "No es poden trobar zones!");
        return
    }
    res.json(plantas)
}


module.exports.renderEditForm = async (req, res) => {
    const planta = await Planta.findById(req.params.id);
    if (!planta) {
        req.flash('error', "No es pot trobar la planta!");
        return res.redirect('/plantas');
    }
    res.render('plantas/edit', { planta });
}

module.exports.updatePlanta = async (req, res) => {
    const { id } = req.params;

    const planta = await Planta.findByIdAndUpdate(id, { ...req.body.planta });
    req.flash('success', 'Planta actualitzada correctament!')
    res.redirect(`/plantas/${planta._id}`);
}

module.exports.deletePlanta = async (req, res) => {
    const { id } = req.params;
    await Planta.findByIdAndDelete(id);
    req.flash('success', 'Planta eliminada correctament!');
    res.redirect('/plantas');
}

