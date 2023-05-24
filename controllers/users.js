const User = require("../models/user");

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
    isAdmin
  });
  return user;
}

async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    req.flash('Usuari esborrat correctament')
    res.sendStatus(200)
  } catch (error) {
    res.flash('L\'usuari no s\'ha pogut esborrar')
    res.sendStatus(400)
  }
}

module.exports = { getAllUsers, getUser, updateUser, deleteUser };
