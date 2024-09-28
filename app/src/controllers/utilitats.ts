import utilitat from '../models/utilitat';

export const index = async (req, res) => {
    const utilitats = await utilitat.find({});
    res.render('utilitats/index', { utilitats });
};


export const renderNewForm = (req, res) => {
    res.render('utilitats/new');
};


export const createUtilitat = async (req, res, next) => {
    let utilitatBody = req.body.utilitat;
    utilitatBody = { ...utilitatBody };
    const newUtilitat = new utilitat(utilitatBody);
    newUtilitat.responsable = req.user._id;
    await newUtilitat.save();
    req.flash('success', 'Àrea creada correctament!');
    res.redirect(`/utilitats/${newUtilitat._id}`);
};

export const showUtilitat = async (req, res, next) => {
    const utilitatDetail = await utilitat.findById(req.params.id).populate('responsable');

    if (!utilitatDetail) {
        req.flash('error', "No es pot trobar l'utilitat!");
        return res.redirect('/utilitats');

    }
    res.render('utilitats/show', { utilitat: utilitatDetail });
};

export const renderEditForm = async (req, res) => {
    const utilitatDetail = await utilitat.findById(req.params.id);

    if (!utilitatDetail) {
        req.flash('error', "No es pot trobar l'àrea!");
        return res.redirect('/utilitats');
    }
    res.render('utilitats/edit', { utilitat: utilitatDetail });
};

export const updateUtilitat = async (req, res) => {
    const { id } = req.params;

    const updatedUtilitat = await utilitat.findByIdAndUpdate(id, { ...req.body.utilitat });
    req.flash('success', 'utilitat actualitzat correctament!');

    res.redirect(`/utilitats/${updatedUtilitat._id}`);
};

export const deleteUtilitat = async (req, res) => {
    const { id } = req.params;
    await utilitat.findByIdAndDelete(id);
    req.flash('success', 'utilitat eliminat correctament!');
    res.redirect('/utilitats');
};
