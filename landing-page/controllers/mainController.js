const appTargetUrl = require("../helpers/getAppUrl");
const cookieParser = require('cookie-parser');
const verifyPassword = require("../helpers/verifyPassword")

exports.loginVerify = (req, res) => {
  const { password } = req.body;
  const isCorrectPassword = verifyPassword(password)

  if (isCorrectPassword) {
    res.cookie('secret', 'pNSc7dbMnpvDeM7', { httpOnly: true });
    res.redirect('/');
  } else {
    res.redirect('/login');
  }
};

// Assuming you already have the view code in views/index.ejs
exports.index = (req, res) => {
  res.render('index', { appTargetUrl: appTargetUrl(), redirect: appTargetUrl("landing") });

  // Redirecting to app for now
  // res.redirect(appTargetUrl())
};

exports.login = (req, res) => {
  res.render('login', { appTargetUrl: appTargetUrl(), redirect: "/" });
};

