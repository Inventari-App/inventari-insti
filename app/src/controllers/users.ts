import User from "../models/user";
import Center from "../models/center";
import { generateHash } from "random-hash";
import { NextFunction, Request, Response } from "express";

import { getExpirationTs } from "../utils/helpers";
import { useNodemailer } from "../nodemailer/sendEmail";
import { getProtocol } from "../utils/helpers";

const protocol = getProtocol();

async function createCenter(req: Request, res: Response, next: NextFunction) {
  try {
    const { center: centerName, name, surname, email, password } = req.body;

    const center = await new Center({ name: centerName }).save();
    const user = new User({
      email,
      username: email,
      name,
      surname,
      center: center._id,
      isAdmin: true,
      verificationTs: getExpirationTs(24 * 60 * 60 * 1000), // 1 day in ms
      verificationHash: generateHash({ length: 8 }),
    });

    center.users.push(user._id);
    center.save();

    await User.register(user, password);

    const { sendEmail, message } = useNodemailer({
      to: user.email,
      model: "user",

      reason: "verify",
    });

    if (sendEmail)
      await sendEmail({
        subject: message.subject,
        text: message.text.replace(
          /{{url}}/,
          `${protocol}://${req.headers.host}/verify?userId=${user.id}&token=${user.verificationHash}`,
        ),
      });

    req.flash(
      "info",
      "Tens 24 hores per activar el teu usuari fent click al link que t'hem enviat per correu.",
    );

    res.redirect("/login");

  } catch (e: unknown) {
    if (e instanceof Error) {
      req.flash("error", e.message);
    } else {
      req.flash("error", "An unknown error occurred.");
    }
    res.redirect("register");
    next(e);
  }
}

async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, centerId } = req.body;
    const user = new User({
      ...req.body,
      username: email,
      center: centerId,
      verificationTs: getExpirationTs(),

      verificationHash: generateHash({ length: 8 }),
    });

    if (!user) {
      throw new Error("Alguna cosa ha sortit malament al crear l'usuari");
    }

    const center = await Center.findById(centerId);
    center.users.push(user._id);

    // User is saved here
    await User.register(user, password);

    const { sendEmail, message } = useNodemailer({
      to: user.email,
      model: "user",
      reason: "verify",
    });
    if (sendEmail) await sendEmail({
      subject: message.subject,
      text: message.text.replace(
        /{{url}}/,
        `${protocol}://${req.headers.host}/verify?userId=${user.id}&token=${user.verificationHash}`,
      ),
    });
    req.flash(
      "info",
      "Avisa el nou usuari, se li ha enviat un correu amb un link de verificacio que ha de clicar per validar el seu compte",
    );
    res.redirect("/users");

  } catch (e: unknown) {
    if (e instanceof Error) {
      req.flash("error", e.message);
    } else {
      req.flash("error", "An unknown error occurred.");
    }
    res.redirect("/users");
    next(e);
  }
}

async function sendPasswordReset(req: Request, res: Response) {
  const { username: email } = req.body;
  // Validate the email and find the user in the database
  const user = await User.findOne({ email });

  if (!user) {
    req.flash("error", "Aquest usuari no existeix.");
    res.redirect("/account-recovery");
    return;
  }

  // Generate a reset token and store it in the user's document
  const resetPasswordHash = generateHash({ length: 8 });
  user.resetPasswordHash = resetPasswordHash;
  user.resetPasswordTs = Date.now() + 3600000; // Token valid for 1 hour
  await user.save();

  // Send an email to the user with the reset token
  const { sendEmail, message } = useNodemailer({
    to: user.email,
    model: "user",
    reason: "reset",
  });

  if (sendEmail) await sendEmail({
    subject: message.subject,
    text: message.text.replace(
      /{{url}}/,

      `${protocol}://${req.headers.host}/reset?userId=${user.id}&token=${resetPasswordHash}`,
    ),
  });

  res.redirect("/reset-sent");
}

async function getAllUsers(next: NextFunction) {
  try {
    const users = await User.find({});
    return users;
  } catch (err) {
    next(err);
  }
}

async function getUser(req: Request, next: NextFunction) {
  try {
    const user = await User.findById(req.params.id).populate("department");
    const center = await Center.findById(user.center).populate("users");
    return { user, center };
  } catch (err) {
    next(err);
  }
}

async function updateUser(req: Request, _res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { isAdmin, password } = req.body.user;
    const user = await User.findByIdAndUpdate(id, {
      ...req.body.user,
      isAdmin: !!isAdmin,
    });

    if (password) {
      await user.setPassword(password);
      await user.save();
    }

    return user;
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    req.flash("success", "Usuari esborrat correctament");
    res.redirect("/users");
  } catch (err) {
    req.flash("error", "L'usuari no s'ha pogut esborrar");
    res.sendStatus(400);
    next(err);
  }
}

async function verifyUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { token, userId } = req.query;
    const user = await User.findById(userId);
    if (!user) {
      req.flash("error", "L'usuari no existeix.");
      res.redirect("/");
    }
    if (!token) {
      req.flash("error", "El token esta buit");
      res.redirect("/");
    }
    const { verificationHash, verificationTs, isVerified } = user;
    if (isVerified) {
      req.flash("error", "L'usuari ja esta verificat.");
      res.redirect("/login");
    }
    const isTokenCorrect = token === verificationHash;

    const isTokenExpired = new Date().getTime() > verificationTs;
    if (!isTokenCorrect) {
      req.flash("error", "El token es invalid o ha expirat");
      res.redirect("/login");
    }
    if (isTokenExpired) {
      const { sendEmail, message } = useNodemailer({
        to: user.email,
        model: "user",
        reason: "verify",
      });
      const newExpirationTs = getExpirationTs(60 * 10 * 1000); // 10 mins
      const newHash = generateHash({ length: 8 });
      user.verificationTs = newExpirationTs;
      user.verificationHash = newHash;
      await user.save();
      if (sendEmail) await sendEmail({
        subject: message.subject,
        text: message.text.replace(
          /{{url}}/,
          `${protocol}://${req.headers.host}/verify?userId=${user.id}&token=${newHash}`,
        ),
      });
      req.flash("error", "El token ha expirat - N'hem enviat un de nou.");
      res.redirect("/login");
    }
    if (isTokenCorrect && !isTokenExpired) {
      user.isVerified = true;
      await user.save();
      req.flash("success", "L'usuari ha estat activat correctament");
      res.redirect("/login");
    }
  } catch (err) {
    next(err);
  }
}

export {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  verifyUser,
  createUser,
  createCenter,
  sendPasswordReset,
};