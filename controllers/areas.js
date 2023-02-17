
const Area = require('../models/area');
module.exports.index = async (req, res) => {

    const areas = await Area.find({});
    res.render('areas/index', { areas })
}

module.exports.renderNewForm = (req, res) => {
    res.render('areas/new');
}

module.exports.createArea = async (req, res, next) => {
    //console.log(req.body)
    let areaBody = req.body.area
    //const albaraArr = JSON.parse(areaBody.albara)
    areaBody = { ...areaBody }
    const area = new Area(areaBody);
    area.responsable = req.user._id;
    await area.save();
    req.flash('success', 'Area creada correctament!');
    res.redirect(`/areas/${area._id}`);
}

module.exports.showArea =  async (req, res, next) => {
    const area = await Area.findById(req.params.id).populate('responsable');
    
    if (!area) {
        req.flash('error', "No es pot trobar la area!");
        return res.redirect('/areas');
    }
    res.render('areas/show', { area });
}

module.exports.getAreas =  async (req, res, next) => {
    const areas = await Area.find()
    
    if (!areas) {
        req.flash('error', "No es poden trobar zones!");
        return
    }
    res.json(areas)
}


module.exports.renderEditForm = async (req, res) => {
    const area = await Area.findById(req.params.id);
    if (!area) {
        req.flash('error', "No es pot trobar la area!");
        return res.redirect('/areas');
    }
    res.render('areas/edit', { area });
}

module.exports.updateArea = async (req, res) => {
    const { id } = req.params;

    const area = await Area.findByIdAndUpdate(id, { ...req.body.area });
    req.flash('success', 'Area actualitzada correctament!')
    res.redirect(`/areas/${area._id}`);
}

module.exports.deleteArea = async (req, res) => {
    const { id } = req.params;
    await Area.findByIdAndDelete(id);
    req.flash('success', 'Area eliminada correctament!');
    res.redirect('/areas');
}

