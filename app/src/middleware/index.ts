import User from "../models/user.ts";
import Invoice from "../models/invoice.ts";
import fetch from "node-fetch";
import { Schema } from "joi";
import { NextFunction, Request, Response } from "express";
import { Model } from "mongoose";
import type { User as UserI } from "../types/models.d.ts";

export const validateSchema =
  (schema: Schema) => (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      console.error(error);
      res.sendStatus(400);
    } else {
      next();
    }
  };

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    //res.session.returnTo = req.originalUrl;
    req.flash("error", "Has d'estar connectat/da");
    return res.redirect("/login");
  }
  next();
};

export const isSameUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const user = await User.findById(id);
  const reqUser: UserI = req.user
  if (!user._id.equals(reqUser?._id)) {
    req.flash("error", "No tens permisos per fer això!");
    return res.redirect(`/invoices`);
  }
  next();
};

export const isSameUserOrAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const user: UserI = await User.findById(id);
    if (user._id != user?.userId && !user?.isAdmin) {
      req.flash("error", "No tens permisos per fer això!");
      return res.redirect(`/invoices`);
    }
    next();
  } catch {
    req.flash("error", "Probablement l'usuari no existeix");
    res.redirect("/users");
  }
};

export const isResponsable =
  (Model: Model<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const reqUser: UserI = req.user
    const model = await Model.findById(id);
    if (!model.responsable.equals(reqUser?._id)) {
      req.flash("error", "No tens permisos per fer això!");
      return res.redirect(`/invoices`);
    }
    next();
  };

export const isResponsableOrAdmin =
  (Model: Model<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const reqUser: UserI = req.user
    const model = await Model.findById(id);
    if (model.responsable._id != reqUser?._id && !reqUser?.isAdmin) {
      req.flash("error", "No tens permisos per fer això!");
      return res.redirect(`/invoices`);
    }
    next();
  };

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user: UserI = await User.findById(req.user?.id);
    if (!user.isAdmin) {
      req.flash("error", "No tens permisos per fer això!");
      return res.redirect(`/invoices`);
    }
    next();
  } catch {
    req.flash("error", "Hi ha hagut un error.");
    return res.redirect(`/invoices`);
  }
};

export const isInvoiceAprovada = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const invoice = await Invoice.findById(id);
  const isRebuda = invoice.status === "rebuda";
  if (isRebuda) {
    req.flash("error", "Aquesta commanda esta rebuda.");
    return res.redirect(`/invoices`);
  }
  next();
};

export const isInvoiceRebuda = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const invoice = await Invoice.findById(id);
  const isRebuda = invoice.status === "rebuda";
  if (!isRebuda) {
    req.flash("error", "Aquesta commanda no esta rebuda.");
    return res.redirect(`/invoices`);
  }
  next();
};

export const requireLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.user) {
    return next();
  } else {
    req.flash("error", "Has d'estar logat per veure la pagina.");
    res.redirect("/login");
  }
};

export const handleRouteError = async (
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { statusCode } = err;
  if (statusCode === 404) {
    res.status(statusCode).render("404");
  } else {
    next(err);
  }
};

export const handleError = async (
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.render("error", { err });
  console.error(err);
  next(err);
};

export const validateRecaptcha = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const gRecaptchaResponse = req.body["g-recaptcha-response"];
    const secret = "6LcDV44pAAAAACxZIgn9aMiGmiovr9sWWfcceTFm";

    const params = new URLSearchParams();
    params.append("secret", secret);
    params.append("response", gRecaptchaResponse);

    const googleRes = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        body: params,
      },
    );
    const googleResJson = await googleRes.json();

    if (googleResJson.success) {
      next();
    } else {
      throw new Error();
    }
  } catch {
    req.flash("error", "Alguna cosa ha anat malament...");
    res.redirect(req.body.redirect);
  }
};
