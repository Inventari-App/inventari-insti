"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.show = exports.index = void 0;
const department_1 = __importDefault(require("../models/department"));
const unitat_1 = __importDefault(require("../models/unitat"));
const article_1 = __importDefault(require("../models/article"));
const item_1 = __importDefault(require("../models/item"));
const helpers_1 = require("../utils/helpers");
const index = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const departaments = yield department_1.default.find();
        const unitats = yield unitat_1.default.find();
        const items = yield item_1.default.find();
        res.render("reports/index", {
            departments: (0, helpers_1.sortByKey)(departaments, 'nom'),
            unitats: (0, helpers_1.sortByKey)(unitats, 'nom'),
            items: (0, helpers_1.sortByKey)(items, 'nom'),
        });
    }
    catch (err) {
        next(err);
    }
});
exports.index = index;
const show = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const articles = yield article_1.default.find(Object.assign({}, filters)).exec();
        res.render("reports/show", { articles });
    }
    catch (err) {
        next(err);
    }
});
exports.show = show;
//# sourceMappingURL=reports.js.map