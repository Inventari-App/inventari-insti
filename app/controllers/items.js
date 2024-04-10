const Item = require("../models/item");
const { localizeBoolean } = require("../utils/helpers");

module.exports.index = async (req, res, next) => {
  try {
    const items = await Item.find({}).populate("responsable");
    res.render("items/index", { items, localizeBoolean });
  } catch (err) {
    next(err);
  }
};

module.exports.renderNewForm = (req, res, next) => {
  try {
    const { tab } = req.query;
    res.render("items/new", { autoclose: tab });
  } catch (err) {
    next(err);
  }
};

module.exports.createItem = async (req, res, next) => {
  try {
    const itemBody = req.body
    const item = new Item(itemBody);
    item.responsable = req.user._id;
    await item.save();
    req.flash("success", "Item creat correctament!");
    if (itemBody.autoclose) {
      res.redirect("/autoclose");
    } else {
      res.redirect(`/items/${item._id}`);
    }
  } catch (err) {
    next(err);
  }
};

module.exports.showItem = async (req, res, next) => {
  try {
    const { user } = req;
    const item = await Item.findById(req.params.id).populate("responsable");
    const responsable = item.responsable;

    if (!item) {
      req.flash("error", "No es pot trobar l'item!");
      return res.redirect("/items");
    }
    res.render("items/show", {
      item,
      isAdmin: user.isAdmin,
      isOwner: responsable && responsable._id.equals(user.id),
      localizeBoolean,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getItems = async (req, res, next) => {
  try {
    const items = await Item.find().populate("responsable");

    if (!items) {
      req.flash("error", "No es poden trobar items!");
      return;
    }
    res.json(items);
  } catch (err) {
    next(err);
  }
};

module.exports.renderEditForm = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      req.flash("error", "No es pot trobar l'item!");
      return res.redirect("/items");
    }
    res.render("items/edit", { item, localizeBoolean });
  } catch (err) {
    next(err);
  }
};

module.exports.updateItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const item = await Item.findByIdAndUpdate(id, { ...req.body.item });
    req.flash("success", "Item actualitzat correctament!");
    res.redirect(`/items/${item._id}`);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Item.findByIdAndDelete(id);
    req.flash("success", "Item eliminat correctament!");
    res.redirect("/items");
  } catch (err) {
    next(err);
  }
};
