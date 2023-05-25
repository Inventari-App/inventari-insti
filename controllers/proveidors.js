
const Proveidor = require('../models/proveidor');
module.exports.index = async (req, res) => {

    const proveidors = await Proveidor.find({});
    res.render('proveidors/index', { proveidors })
}

module.exports.renderNewForm = (req, res) => {
    res.render('proveidors/new');
}

module.exports.createProveidor = async (req, res, next) => {
    //console.log(req.body)
    let proveidorBody = req.body.proveidor
    //const albaraArr = JSON.parse(proveidorBody.albara)
    proveidorBody = { ...proveidorBody }
    const proveidor = new Proveidor(proveidorBody);
    proveidor.responsable = req.user._id;
    await proveidor.save();
    req.flash('success', 'Proveidor creat correctament!');
    res.status(201).json(proveidor);
}

module.exports.showProveidor =  async (req, res, next) => {
    const proveidor = await Proveidor.findById(req.params.id).populate('responsable');
    
    if (!proveidor) {
        req.flash('error', "No es pot trobar el proveidor!");
        return res.redirect('/proveidors');
    }
    res.render('proveidors/show', { proveidor });
}

module.exports.getProveidors =  async (req, res, next) => {
    const proveidors = await Proveidor.find()
    
    if (!proveidors) {
        req.flash('error', "No es poden trobar proveidors!");
        return
    }
    res.json(proveidors)
}


module.exports.renderEditForm = async (req, res) => {
    const proveidor = await Proveidor.findById(req.params.id);
    if (!proveidor) {
        req.flash('error', "No es pot trobar el proveidor!");
        return res.redirect('/proveidors');
    }
    res.render('proveidors/edit', { proveidor });
}

module.exports.updateProveidor = async (req, res) => {
    const { id } = req.params;

    const proveidor = await Proveidor.findByIdAndUpdate(id, { ...req.body.proveidor });
    req.flash('success', 'Proveidor actualitzat correctament!')
    res.redirect(`/proveidors/${proveidor._id}`);
}

module.exports.deleteProveidor = async (req, res) => {
    const { id } = req.params;
    await Proveidor.findByIdAndDelete(id);
    req.flash('success', 'Proveidor eliminat correctament!');
    res.redirect('/proveidors');
}

