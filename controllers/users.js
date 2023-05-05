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
  const { id } = req.params;
  await User.findByIdAndDelete(id);
}

module.exports = { getAllUsers, getUser, updateUser, deleteUser };
