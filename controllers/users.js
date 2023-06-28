const User = require("../models/user");
const { generateHash } = require("random-hash");
const { getExpirationTs } = require("../utils/helpers");
const { useNodemailer } = require("../nodemailer/sendEmail");

async function createUser(req, res, next) {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    await User.register(user, password);
    const { sendEmail, message } = useNodemailer({
      to: user.email,
      model: "user",
      reason: "verify",
    });
    await sendEmail({
      subject: message.subject,
      text: message.text.replace(
        /{{url}}/,
        `http://${req.headers.host}/verify?userId=${user.id}&token=${user.verificationHash}`
      ),
    });
    req.flash("info", "Tens 10 minuts per activar el teu usuari fent click al link que t'hem enviat per correu.")
    res.redirect("/login")
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
}

async function getAllUsers(req, res, next) {
  const users = await User.find({});
  return users;
}

async function getUser(req, res, next) {
  const user = await User.findById(req.params.id);
  return user;
}

async function updateUser(req, res, next) {
  const { id } = req.params;
  const { isAdmin } = req.body.user;
  const user = await User.findByIdAndUpdate(id, {
    ...req.body.user,
    isAdmin,
  });
  return user;
}

async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    req.flash("success", "Usuari esborrat correctament");
    res.sendStatus(200);
  } catch (error) {
    req.flash("error", "L'usuari no s'ha pogut esborrar");
    res.sendStatus(400);
  }
}

async function verifyUser(req, res, next) {
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
    const newExpirationTs = getExpirationTs(60 * 10 * 1000); // 10mins
    const newHash = generateHash({ length: 8 });
    user.verificationTs = newExpirationTs;
    user.verificationHash = newHash;
    await user.save();
    await sendEmail({
      subject: message.subject,
      text: message.text.replace(
        /{{url}}/,
        `http://${req.headers.host}/verify?userId=${user.id}&token=${newHash}`
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
}

module.exports = { getAllUsers, getUser, updateUser, deleteUser, verifyUser, createUser };
