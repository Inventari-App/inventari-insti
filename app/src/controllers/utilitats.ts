import { NextFunction, Request, Response } from 'express';
import utilitat from '../models/utilitat';

export const index = async (_req: Request, res: Response) => {
    const utilitats = await utilitat.find({});
    res.render('utilitats/index', { utilitats });
};


export const renderNewForm = (_req: Request, res: Response) => {
    res.render('utilitats/new');
};


export const createUtilitat = async (req: Request, res: Response) => {
    let utilitatBody = req.body.utilitat;
    utilitatBody = { ...utilitatBody };
    const newUtilitat = new utilitat(utilitatBody);
    newUtilitat.responsable = req.user?._id;
    await newUtilitat.save();
    req.flash('success', 'Àrea creada correctament!');
    res.redirect(`/utilitats/${newUtilitat._id}`);
};

export const showUtilitat = async (req: Request, res: Response) => {
    const utilitatDetail = await utilitat.findById(req.params.id).populate('responsable');

    if (!utilitatDetail) {
        req.flash('error', "No es pot trobar l'utilitat!");
        return res.redirect('/utilitats');

    }
    res.render('utilitats/show', { utilitat: utilitatDetail });
};

export const renderEditForm = async (req: Request, res: Response) => {
    const utilitatDetail = await utilitat.findById(req.params.id);

    if (!utilitatDetail) {
        req.flash('error', "No es pot trobar l'àrea!");
        return res.redirect('/utilitats');
    }
    res.render('utilitats/edit', { utilitat: utilitatDetail });
};

export const updateUtilitat = async (req: Request, res: Response) => {
    const { id } = req.params;

    const updatedUtilitat = await utilitat.findByIdAndUpdate(id, { ...req.body.utilitat });
    req.flash('success', 'utilitat actualitzat correctament!');

    res.redirect(`/utilitats/${updatedUtilitat._id}`);
};

export const deleteUtilitat = async (req: Request, res: Response) => {
    const { id } = req.params;
    await utilitat.findByIdAndDelete(id);
    req.flash('success', 'utilitat eliminat correctament!');
    res.redirect('/utilitats');
};
