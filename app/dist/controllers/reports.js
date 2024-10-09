var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Departament from "../models/department";
import Unitat from "../models/unitat";
import Article from "../models/article";
import Item from "../models/item";
import { sortByKey } from "../utils/helpers";
export const index = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const departaments = yield Departament.find();
        const unitats = yield Unitat.find();
        const items = yield Item.find();
        res.render("reports/index", {
            departments: sortByKey(departaments, 'nom'),
            unitats: sortByKey(unitats, 'nom'),
            items: sortByKey(items, 'nom'),
        });
    }
    catch (err) {
        next(err);
    }
});
export const show = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = {};
        const filterKeys = ["department", "article", "unitat"];
        filterKeys.forEach(filter => {
            let filterVal = req.query[filter];
            if (!filterVal)
                return;
            if (filterVal === 'all')
                filterVal = '.*';
            const filterRegex = new RegExp(filterVal, 'i');
            filters[filter] = filterRegex;
        });
        const articles = yield Article.find(Object.assign({}, filters)).exec();
        res.render("reports/show", { articles });
    }
    catch (err) {
        next(err);
    }
});
