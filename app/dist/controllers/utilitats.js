var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import utilitat from '../models/utilitat';
export const index = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const utilitats = yield utilitat.find({});
    res.render('utilitats/index', { utilitats });
});
export const renderNewForm = (_req, res) => {
    res.render('utilitats/new');
};
export const createUtilitat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let utilitatBody = req.body.utilitat;
    utilitatBody = Object.assign({}, utilitatBody);
    const newUtilitat = new utilitat(utilitatBody);
    newUtilitat.responsable = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    yield newUtilitat.save();
    req.flash('success', 'Àrea creada correctament!');
    res.redirect(`/utilitats/${newUtilitat._id}`);
});
export const showUtilitat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const utilitatDetail = yield utilitat.findById(req.params.id).populate('responsable');
    if (!utilitatDetail) {
        req.flash('error', "No es pot trobar l'utilitat!");
        return res.redirect('/utilitats');
    }
    res.render('utilitats/show', { utilitat: utilitatDetail });
});
export const renderEditForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const utilitatDetail = yield utilitat.findById(req.params.id);
    if (!utilitatDetail) {
        req.flash('error', "No es pot trobar l'àrea!");
        return res.redirect('/utilitats');
    }
    res.render('utilitats/edit', { utilitat: utilitatDetail });
});
export const updateUtilitat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updatedUtilitat = yield utilitat.findByIdAndUpdate(id, Object.assign({}, req.body.utilitat));
    req.flash('success', 'utilitat actualitzat correctament!');
    res.redirect(`/utilitats/${updatedUtilitat._id}`);
});
export const deleteUtilitat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield utilitat.findByIdAndDelete(id);
    req.flash('success', 'utilitat eliminat correctament!');
    res.redirect('/utilitats');
});
