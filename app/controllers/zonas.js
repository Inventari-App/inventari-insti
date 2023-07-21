
const Zona = require('../models/zona');
module.exports.index = async (req, res) => {

    const zonas = await Zona.find({});
    res.render('zonas/index', { zonas })
}

module.exports.renderNewForm = (req, res) => {
    res.render('zonas/new');
}

module.exports.createZona = async (req, res, next) => {
    //console.log(req.body)
    let zonaBody = req.body.zona
    //const albaraArr = JSON.parse(zonaBody.albara)
    zonaBody = { ...zonaBody }
    const zona = new Zona(zonaBody);
    zona.responsable = req.user._id;
    await zona.save();
    req.flash('success', 'Zona creada correctament!');
    res.redirect(`/zonas/${zona._id}`);
}

module.exports.showZona =  async (req, res, next) => {
    const zona = await Zona.findById(req.params.id).populate('responsable');
    
    if (!zona) {
        req.flash('error', "No es pot trobar la zona!");
        return res.redirect('/zonas');
    }
    res.render('zonas/show', { zona });
}

module.exports.getZonas =  async (req, res, next) => {
    const zonas = await Zona.find()
    
    if (!zonas) {
        req.flash('error', "No es poden trobar zones!");
        return
    }
    res.json(zonas)
}


module.exports.renderEditForm = async (req, res) => {
    const zona = await Zona.findById(req.params.id);
    if (!zona) {
        req.flash('error', "No es pot trobar la zona!");
        return res.redirect('/zonas');
    }
    res.render('zonas/edit', { zona });
}

module.exports.updateZona = async (req, res) => {
    const { id } = req.params;

    const zona = await Zona.findByIdAndUpdate(id, { ...req.body.zona });
    req.flash('success', 'Zona actualitzada correctament!')
    res.redirect(`/zonas/${zona._id}`);
}

module.exports.deleteZona = async (req, res) => {
    const { id } = req.params;
    await Zona.findByIdAndDelete(id);
    req.flash('success', 'Zona eliminada correctament!');
    res.redirect('/zonas');
}

