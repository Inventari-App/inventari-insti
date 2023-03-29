
const Invoice = require('../models/invoice');
const Item = require('../models/item');
const autocomplete = require('autocompleter');

module.exports.index = async (req, res) => {

  const invoices = await Invoice
    .find()
    .populate('responsable')
    .sort({ createdAt: -1 })

  res.render('invoices/index', { invoices })
}

module.exports.renderNewForm = (req, res) => {
  res.render('invoices/new', { autocomplete });
}

module.exports.createInvoice = async (req, res, next) => {
  const { invoiceItems } = req.body
  const responsable = req.user._id;
  const invoice = new Invoice({ responsable, invoiceItems })
  await invoice.save()
  req.flash('success', 'Comanda creada correctament!');
  res.json(invoice)
}

module.exports.showInvoice = async (req, res, next) => {
  const invoice = await Invoice.findById(req.params.id).populate('responsable');

  if (!invoice) {
    req.flash('error', "No es pot trobar l'invoice!");
    return res.redirect('/invoices');
  }

  const items = await Item.find()
  res.render('invoices/show', { invoice, items });
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

