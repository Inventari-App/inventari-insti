const Departament = require("../models/department")
const Unitat = require("../models/unitat")
const Article = require("../models/article");
const Item = require("../models/item");
const { sortByKey } = require("../utils/helpers");

module.exports.index = async (req, res, next) => {
  try {
    const departaments = await Departament.find()
    const unitats = await Unitat.find()
    const items = await Item.find()
    res.render("reports/index", {
      departaments: sortByKey(departaments, 'nom'),
      unitats: sortByKey(unitats, 'nom'),
      items: sortByKey(items, 'nom'),
    });
  } catch (err) {
    next(err);
  }
};

module.exports.show = async (req, res, next) => {
  try {
    const filters = {}
    const filterKeys = ["departament", "article", "unitat"]
    filterKeys.forEach(filter => {
      const filterVal = req.query[filter]
      if (!filterVal) return
      const filterRegex = new RegExp(filterVal, 'i')
      filters[filter] = filterRegex
    })
    const articles = await Article.find({ ...filters }).exec()
    res.render("reports/show", { articles });
  } catch (err) {
    next(err);
  }
};
