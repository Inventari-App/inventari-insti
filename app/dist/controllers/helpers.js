var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { capitalize } from "../utils/helpers";
export const renderNewForm = (path) => (req, res, next) => {
    try {
        const { tab } = req.query;
        res.render(path, { autoclose: tab });
    }
    catch (err) {
        next(err);
    }
};
export const createItem = (Model, modelName, errorHandler) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const data = req.body;
        const model = new Model(data);
        model.responsable = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        yield model.save();
        req.flash("success", `${capitalize(modelName)} creat/da correctament!`);
        if (data.autoclose) {
            res.redirect("/autoclose");
        }
        else {
            res.redirect(`/${modelName}s/${model._id}`);
        }
    }
    catch (err) {
        if (err instanceof Error && "code" in err && err.code == 11000) {
            req.flash("error", `Un/a ${modelName} amb el mateix nom ja existeix.`);
            return res.redirect(`/${modelName}s/new${req.query.tab ? "?tab=true" : ""}`);
        }
        if (errorHandler) {
            errorHandler(req, res, next);
        }
        else {
            next(err);
        }
    }
});
