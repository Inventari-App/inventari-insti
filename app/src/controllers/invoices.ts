import Invoice, { Invoice as InvoiceI, InvoiceItem } from "../models/invoice";
import Item from "../models/item";
import autocomplete from "autocompleter";
import { useNodemailer } from "../nodemailer/sendEmail";
import { getProtocol, localizeBoolean, twoDecimals } from "../utils/helpers";
import Department from "../models/department";
import Center from "../models/center";
import { NextFunction, Request, Response } from "express";
import { Document } from "mongoose";
import { User as UserI } from "../types/models";
import User from "@/models/user";

const protocol = getProtocol();

export const index = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user } = req;
    const { status } = req.query;

    // Filter by invoice status if provided
    const filter: { status?: string } = {};
    if (
      status &&
      ["pendent", "aprovada", "rebuda"].includes(status as string)
    ) {
      filter.status = status as string;
    }

    // Show only user/admin invoices based on filter
    const invoices = await Invoice.find(
      !user?.isAdmin
        ? { ...filter, responsable: { _id: user?.userId } }
        : filter,
    )
      .populate("responsable")
      .sort({ createdAt: -1 });

    res.render("invoices/index", { invoices });
  } catch (err) {
    next(err);
  }
};

export const renderNewForm = async (_req: Request, res: Response) => {
  res.render("invoices/new", {
    autocomplete,
  });
};

export const createInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { invoiceItems, comment } = req.body;
    if (!invoiceItems.length) {
      res.status(400).send("Bad request");
    }

    const { user } = req;
    const department = await Department.findById(user?.department);

    const invoice = new Invoice({
      responsable: user?.responsableId,
      invoiceItems,
      comment,
      department: department.nom,
    });
    await invoice.save();
    await emailCreated(invoice, user!.email, req.headers.host!);
    req.flash("success", "Comanda creada correctament!");
    res.json(invoice);
  } catch (err) {
    next(err);
  }
};

export const showInvoice = async (req: Request, res: Response) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate("responsable")
    .populate({
      path: "responsable",
      populate: { path: "department" }, // Complete path for nested population
    })
    .lean();

  if (!invoice) {
    req.flash("error", "No es pot trobar l'invoice!");
    return res.redirect("/invoices");
  }

  const items = await Item.find({
    nom: {
      $in: invoice.invoiceItems.map((item: InvoiceItem) => item.article),
    },
  });

  res.render(
    invoice.status === "aprovada" ? "invoices/receive" : "invoices/show",
    {
      invoice,
      items,
      invoiceJSON: JSON.stringify(invoice),
      isResponsable: invoice.responsable._id.equals(req.user?.id),
      localizeBoolean,
    },
  );
};

export const printInvoice = async (req: Request, res: Response) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate("responsable")
    .populate({
      path: "responsable",
      populate: { path: "department" }, // Complete path for nested population
    })
    .lean();

  if (!invoice) {
    req.flash("error", "No es pot trobar l'invoice!");
    return res.redirect("/invoices");
  }

  const items = await Item.find({
    nom: {
      $in: invoice.invoiceItems.map((item: InvoiceItem) => item.article),
    },
  });

  const center = await Center.findById(invoice.center);

  res.render("invoices/print", {
    invoice,
    items,
    center,
    invoiceJSON: JSON.stringify(invoice),
    isResponsable: invoice.responsable._id.equals(req.user?.id),
    twoDecimals,
  });
};

export const renderEditForm = async (req: Request, res: Response) => {
  const invoice = await Invoice.findById(req.params.id).populate("responsable");

  if (!invoice) {
    req.flash("error", "No es pot trobar l'invoice!");
    return res.redirect("/invoices");
  }

  res.render("invoices/edit", { invoice, autocomplete });
};

export const updateInvoiceStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const invoice = await Invoice.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    ).populate("responsable");

    if (status === "rebuda" && req.headers.host) await emailReceived(invoice, req.headers.host);
    if (status !== "rebuda" && req.headers.host)
      await emailStatusChange(invoice, status, req.headers.host);
    res.redirect("/invoices");
  } catch (error) {
    console.error(error);
  }
};

export const updateInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { redirect } = req.query;
    const { user } = req;

    const invoice = await Invoice.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true },
    ).populate("responsable");

    if (req.user && req.headers.host) {
      await emailModified({ invoice, user: req.user, host: req.headers.host });
    }

    req.flash("success", "Comanda actualitzada correctament!");

    if (redirect)
      return user?.isAdmin
        ? res.redirect(`/invoices`)
        : res.redirect(`/invoices/${id}`);

    return res.status(201).json(invoice.toJSON());
  } catch (error) {
    console.error(error);
  }
};

export const deleteInvoice = async (req: Request, res: Response) => {
  const { id } = req.params;

  await Invoice.findByIdAndDelete(id);
  req.flash("success", "Comanda eliminada correctament!");
  res.redirect("/invoices");
};

async function getAdminEmails() {
  const admins = await User.find({ isAdmin: true }).exec();
  const adminEmails =
    admins.length && admins.map((admin: UserI) => admin.email).join("; ");
  return adminEmails;
}

async function emailCreated(invoice: Document, email: string, host: string) {
  const adminEmails = await getAdminEmails();
  if (!adminEmails) return console.error("No admin emails?");

  const { message, sendEmail } = useNodemailer({
    to: adminEmails,
    model: "invoice",
    reason: "created",
  });
  return (
    sendEmail &&
    sendEmail({
      subject: message.subject.replace(/{{user}}/, email),
      text: message.text.replace(
        /{{url}}/,
        `${protocol}://${host}/invoices/${invoice._id}`,
      ),
    })
  );
}

async function emailModified({
  invoice,
  user,
  host,
}: {
  invoice: InvoiceI;
  user: UserI;
  host: string;
}) {
  const adminEmails = await getAdminEmails();
  if (!adminEmails) return console.error("No admin emails?");

  const responsableEmail = invoice.responsable.email;

  // 1. User === responsable => email admin
  // 2. User !== responsable => email responsable
  // 3. User === responsable && isAdmin => email admin??

  const responsableIsEditing = user.email === responsableEmail;
  // const adminIsEditing = user.isAdmin

  const { message, sendEmail } = useNodemailer({
    to: responsableIsEditing ? adminEmails : responsableEmail,
    model: "invoice",
    reason: "modified",
  });
  return (
    sendEmail &&
    sendEmail({
      subject: message.subject,
      text: message.text
        .replace(/{{user}}/, invoice.responsable.email)
        .replace(/{{url}}/, `${protocol}://${host}/invoices/${invoice._id}`),
    })
  );
}

async function emailStatusChange(
  invoice: InvoiceI,
  status: string,
  host: string,
) {
  const adminEmails = await getAdminEmails();
  if (!adminEmails) return console.error("No admin emails?");

  const responsableEmail = invoice.responsable.email;
  const { message, sendEmail } = useNodemailer({
    to: /aprovada|pendent/.test(status) ? responsableEmail : adminEmails,
    model: "invoice",
    reason: "status",
  });
  return message && sendEmail({
    subject: message.subject.replace(/{{status}}/, status),
    text: message.text
      .replace(/{{user}}/, invoice.responsable.email)
      .replace(/{{status}}/, status)
      .replace(/{{url}}/, `${protocol}://${host}/invoices/${invoice._id}`),
  });
}

async function emailReceived(invoice: InvoiceI, host: string) {
  const adminEmails = await getAdminEmails();
  if (!adminEmails) return console.error("No admin emails?");

  const responsableEmail = invoice.responsable.email;
  const { message, sendEmail } = useNodemailer({
    to: adminEmails,
    model: "invoice",
    reason: "received",
  });
  return message && sendEmail({
    subject: message.subject,
    text: message.text
      .replace(/{{user}}/, responsableEmail)
      .replace(/{{url}}/, `${protocol}://${host}/invoices`),
  });
}
