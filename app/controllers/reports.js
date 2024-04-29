const Departament = require("../models/department")
const Unitat = require("../models/unitat")
const Inventari = require("../models/inventari");
const Item = require("../models/item");

module.exports.index = async (req, res, next) => {
  try {
    const departaments = await Departament.find()
    const unitats = await Unitat.find()
    const items = await Item.find()
    res.render("reports/index", { departaments, unitats, items });
  } catch (err) {
    next(err);
  }
};

module.exports.show = async (req, res, next) => {
  try {
    const { departament, item, unitat } = req.query
    const departamentRegex = new RegExp(departament, 'i')
    const itemRegex = new RegExp(item, 'i')
    const unitatRegex = new RegExp(unitat, 'i')
    const inventaris = await Inventari.find({ departament: departamentRegex, item: itemRegex, unitat: unitatRegex })
    res.render("reports/show", { inventaris });
  } catch (err) {
    next(err);
  }
};
