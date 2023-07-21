const flash = require("connect-flash");

function configureFlash (app) {
  app.use(flash());
  app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.info = req.flash("info")
    res.locals.error = req.flash("error");
    next();
  });
}

module.exports = configureFlash