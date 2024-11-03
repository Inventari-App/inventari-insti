const appTargetUrl = require("../helpers/getAppUrl");
const cookieParser = require('cookie-parser');

exports.loginVerify = (req, res) => {
  const { password } = req.body;
  const hardcodedPassword = "Bali&Jero2023";

  if (password === hardcodedPassword) {
    res.cookie('authenticated', true, { httpOnly: true });
    res.redirect('/');
  } else {
    res.redirect('/login');
  }
};
  // Assuming you already have the view code in views/index.ejs
  res.render('index', { appTargetUrl: appTargetUrl(), redirect: appTargetUrl("landing") });

  // Redirecting to app for now
  // res.redirect(appTargetUrl())
};

exports.login = (req, res) => {
  res.render('login', { appTargetUrl: appTargetUrl(), redirect: "/" });
};
