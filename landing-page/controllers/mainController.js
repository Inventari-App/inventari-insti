const appTargetUrl = require("../helpers/getAppUrl")

exports.index = (req, res) => {
  // Assuming you already have the view code in views/index.ejs
  res.render('indexBlank', { appTargetUrl: appTargetUrl(), redirect: appTargetUrl("landing") });
};
