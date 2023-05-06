const Invoice = require("../models/invoice");
const Item = require("../models/item");
const Unitat = require("../models/unitat");
const Proveidor = require("../models/proveidor");
const autocomplete = require("autocompleter");
const checkComandaIsRebuda = require('../utils/checkComandaIsRebuda');

module.exports.index = async (req, res) => {
  const { isAdmin, id: userId } = req.user;

  // Show only user/admin invoices
  const invoices = await Invoice.find(
    !isAdmin ? { responsable: { _id: userId } } : {}
  )
    .populate("responsable")
    .sort({ createdAt: -1 });

  res.render("invoices/index", { invoices });
};

module.exports.renderNewForm = async (req, res) => {
  res.render("invoices/new", {
    autocomplete,
  });
};

module.exports.createInvoice = async (req, res, next) => {
  const { invoiceItems } = req.body;
  const responsable = req.user._id;
  const invoice = new Invoice({ responsable, invoiceItems });
  await invoice.save();
  req.flash("success", "Comanda creada correctament!");
  res.json(invoice);
};

module.exports.showInvoice = async (req, res, next) => {
  const invoice = await Invoice.findById(req.params.id).populate("responsable").lean()

  if (!invoice) {
    req.flash("error", "No es pot trobar l'invoice!");
    return res.redirect("/invoices");
  }

  const items = await Item.find();
  res.render(
    invoice.status === "aprovada" ? "invoices/receive" : "invoices/show",
    {
      invoice,
      invoiceJSON: JSON.stringify(invoice),
      items,
    }
  );
};

module.exports.renderEditForm = async (req, res) => {
  const invoice = await Invoice.findById(req.params.id).populate("responsable");

  if (!invoice) {
    req.flash("error", "No es pot trobar l'invoice!");
    return res.redirect("/invoices");
  }

  res.render("invoices/edit", { invoice, autocomplete });
};

module.exports.updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { redirect } = req.query
  
    const invoice = await Invoice.findByIdAndUpdate(id, { ...req.body }, { new: true });
    const comandaIsRebuda = checkComandaIsRebuda(invoice);
    
    req.flash("success", "Comanda actualitzada correctament!");

    if (redirect) return res.redirect(`/invoices/${id}`)
  
    if (comandaIsRebuda) {
      await Invoice.findByIdAndUpdate(id, { status: "rebuda" })
      return res.status(201).send()
    }

    if (!comandaIsRebuda) return res.status(201).send()
  } catch (error) {
    console.error(error)
  }
};

module.exports.deleteInvoice = async (req, res) => {
  const { id } = req.params;

  await Invoice.findByIdAndDelete(id);
  req.flash("success", "Comanda eliminada correctament!");
  res.redirect("/invoices");
};