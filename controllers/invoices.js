const User = require("../models/user");
const Invoice = require("../models/invoice");
const Item = require("../models/item");
const autocomplete = require("autocompleter");
const { useNodemailer } = require("../nodemailer/sendEmail");

module.exports.index = async (req, res) => {
  const { isAdmin, id: userId } = req.user;
  const { status } = req.query;

  // Filter by invoice status if provided
  const filter = {};
  if (status && ["pendent", "aprovada", "rebuda"].includes(status)) {
    filter.status = status;
  }

  // Show only user/admin invoices based on filter
  const invoices = await Invoice.find(
    !isAdmin ? { ...filter, responsable: { _id: userId } } : filter
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
  const { _id: responsableId, email } = req.user;
  const invoice = new Invoice({ responsable: responsableId, invoiceItems });
  await invoice.save();
  await emailCreated(invoice, email)
  req.flash("success", "Comanda creada correctament!");
  res.json(invoice);
};

module.exports.showInvoice = async (req, res, next) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate("responsable")
    .lean();

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
      isResponsable: invoice.responsable._id.equals(req.user.id)
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

module.exports.updateInvoiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body

    const invoice = await Invoice.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("responsable");

    status === 'rebuda'
      ? await emailReceived(invoice)
      : await emailStatusChange(invoice, status);

    res.redirect('/invoices');
  } catch (error) {
    console.error(error);
  }
};


module.exports.updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { redirect } = req.query;
    const { isAdmin } = req.user

    const invoice = await Invoice.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    ).populate("responsable");

    await emailModified({ invoice, user: req.user })

    req.flash("success", "Comanda actualitzada correctament!");

    if (redirect) return isAdmin
      ? res.redirect(`/invoices`)
      : res.redirect(`/invoices/${id}`)

    return res.status(201).json(invoice.toJSON())
  } catch (error) {
    console.error(error);
  }
};


module.exports.deleteInvoice = async (req, res) => {
  const { id } = req.params;

  await Invoice.findByIdAndDelete(id);
  req.flash("success", "Comanda eliminada correctament!");
  res.redirect("/invoices");
};

async function getAdminEmails () {
  const admins = await User.find({ isAdmin: true }).exec();
  const adminEmails = admins.length && admins.map(admin => admin.email).join('; ')
  return adminEmails
}

async function emailCreated (invoice, email) {
  const adminEmails = await getAdminEmails()
  if (!adminEmails) return console.error('No admin emails?')

  const { message, sendEmail } = useNodemailer({
    to: adminEmails,
    model: "invoice",
    reason: "created",
  });
  return sendEmail({
    subject: message.subject.replace(/{{user}}/, email),
    text: message.text
      .replace(/{{url}}/, `http://${req.headers.host}/invoices/${invoice._id}`)
  })
}

async function emailModified ({ invoice, user }) {
  const adminEmails = await getAdminEmails()
  if (!adminEmails) return console.error('No admin emails?')

  const responsableEmail = invoice.responsable.email

  // 1. User === responsable => email admin
  // 2. User !== responsable => email responsable
  // 3. User === responsable && isAdmin => email admin??

  const responsableIsEditing = user.email === responsableEmail
  // const adminIsEditing = user.isAdmin

  const { message, sendEmail } = useNodemailer({
    to: responsableIsEditing
      ? adminEmails
      : responsableEmail,
    model: "invoice",
    reason: "modified",
  });
  return sendEmail({
    subject: message.subject,
    text: message.text
      .replace(/{{user}}/, invoice.responsable.email)
      .replace(/{{url}}/, `http://${req.headers.host}/invoices/${invoice._id}`)
  })
}

async function emailStatusChange (invoice, status) {
  const adminEmails = await getAdminEmails()
  if (!adminEmails) return console.error('No admin emails?')

  const responsableEmail = invoice.responsable.email
  const { message, sendEmail } = useNodemailer({
    to: /aprovada|pendent/.test(status)
      ? responsableEmail
      : adminEmails,
    model: "invoice",
    reason: "status",
  });
  return sendEmail({
    subject: message.subject.replace(/{{status}}/, status),
    text: message.text
      .replace(/{{user}}/, invoice.responsable.email)
      .replace(/{{status}}/, status)
      .replace(/{{url}}/, `http://${req.headers.host}/invoices/${invoice._id}`)
  })
}

async function emailReceived (invoice) {
  const adminEmails = await getAdminEmails()
  if (!adminEmails) return console.error('No admin emails?')

  const responsableEmail = invoice.responsable.email
  const { message, sendEmail } = useNodemailer({
    to: adminEmails,
    model: "invoice",
    reason: "received",
  });
  return sendEmail({
    subject: message.subject,
    text: message.text
      .replace(/{{user}}/, responsableEmail)
      .replace(/{{url}}/, ' http://${req.headers.host}/invoices')
  })
}