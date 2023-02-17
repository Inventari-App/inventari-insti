
const Invoice = require('../models/invoice');
const autocomplete = require('autocompleter');

module.exports.index = async (req, res) => {

    const invoices = await Invoice
        .find({})
        .populate('responsable')

    res.render('invoices/index', { invoices })
}

module.exports.renderNewForm = (req, res) => {
    res.render('invoices/new', { autocomplete });
}

module.exports.createInvoice = async (req, res, next) => {
    
    let invoiceBody = req.body.invoice
    const invoiceArr = JSON.parse(invoiceBody.invoice)
    invoiceBody = { ...invoiceBody, invoice: invoiceArr }
    const invoice = new Invoice(invoiceBody);
    invoice.responsable = req.user._id;
    await invoice.save();
    req.flash('success', 'Comanda creada correctament!');
    res.redirect(`/invoices/${invoice._id}`);
}

module.exports.showInvoice =  async (req, res, next) => {
    const invoice = await Invoice.findById(req.params.id).populate('responsable');
    
    if (!invoice) {
        req.flash('error', "No es pot trobar l'invoice!");
        return res.redirect('/invoices');
    }
    res.render('invoices/show', { invoice });
}

module.exports.renderEditForm = async (req, res) => {
    const invoice = await Invoice.findById(req.params.id).populate('responsable');
    if (!invoice) {
        req.flash('error', "No es pot trobar l'invoice!");
        return res.redirect('/invoices');
    }
    res.render('invoices/edit', { invoice, autocomplete });
}

module.exports.updateInvoice = async (req, res) => {
    const { id } = req.params;

    const invoice = await Invoice.findByIdAndUpdate(id, { ...req.body.invoice });
    req.flash('success', 'Invoice actualitzat correctament!')
    res.redirect(`/invoices/${invoice._id}`);


    
}

module.exports.deleteInvoice = async (req, res) => {
    const { id } = req.params;
    await Invoice.findByIdAndDelete(id);
    req.flash('success', 'Invoice eliminat correctament!');
    res.redirect('/invoices');
}

