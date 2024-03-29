const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

function configurePassport (app) {
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

  app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next()
  })
}

module.exports = configurePassport
