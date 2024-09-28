import Departament from "../models/department";
import Unitat from "../models/unitat";
import Article from "../models/article";
import Item from "../models/item";
import { sortByKey } from "../utils/helpers";

export const index = async (req, res, next) => {
  try {
    const departaments = await Departament.find();
    const unitats = await Unitat.find();
    const items = await Item.find();
    res.render("reports/index", {
      departments: sortByKey(departaments, 'nom'),
      unitats: sortByKey(unitats, 'nom'),
      items: sortByKey(items, 'nom'),
    });
  } catch (err) {
    next(err);
  }
};

export const show = async (req, res, next) => {
  try {
    const filters = {};
    const filterKeys = ["department", "article", "unitat"];
    filterKeys.forEach(filter => {
      let filterVal = req.query[filter];
      if (!filterVal) return;
      if (filterVal === 'all') filterVal = '.*';
      const filterRegex = new RegExp(filterVal, 'i');
      filters[filter] = filterRegex;
    });
    const articles = await Article.find({ ...filters }).exec();
    res.render("reports/show", { articles });
  } catch (err) {
    next(err);
  }
};

