
const Item = require('../models/item');
module.exports.index = async (req, res) => {

    const items = await Item.find({});
    res.render('items/index', { items })
}

module.exports.renderNewForm = (req, res) => {
    res.render('items/new');
}

module.exports.createItem = async (req, res, next) => {
    //console.log(req.body)
    let itemBody = req.body.item
    //const albaraArr = JSON.parse(itemBody.albara)
    itemBody = { ...itemBody }
    const item = new Item(itemBody);
    item.responsable = req.user._id;
    await item.save();
    req.flash('success', 'Item creat correctament!');
    res.redirect(`/items/${item._id}`);
}

module.exports.showItem =  async (req, res, next) => {
    const item = await Item.findById(req.params.id).populate('responsable');
    
    if (!item) {
        req.flash('error', "No es pot trobar l'item!");
        return res.redirect('/items');
    }
    res.render('items/show', { item });
}

module.exports.getItems =  async (req, res, next) => {
    const items = await Item.find()
    
    if (!items) {
        req.flash('error', "No es poden trobar items!");
        return
    }
    res.json(items)
}

module.exports.renderEditForm = async (req, res) => {
    const item = await Item.findById(req.params.id);
    if (!item) {
        req.flash('error', "No es pot trobar l'item!");
        return res.redirect('/items');
    }
    res.render('items/edit', { item });
}

module.exports.updateItem = async (req, res) => {
    const { id } = req.params;

    const item = await Item.findByIdAndUpdate(id, { ...req.body.item });
    req.flash('success', 'Item actualitzat correctament!')
    res.redirect(`/items/${item._id}`);
}

module.exports.deleteItem = async (req, res) => {
    const { id } = req.params;
    await Item.findByIdAndDelete(id);
    req.flash('success', 'Item eliminat correctament!');
    res.redirect('/items');
}

