import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "./models/user";
import Center from "./models/center";
import { Express } from "express";

function configurePassport(app: Express) {
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

  app.use(async (req, res, next) => {
    res.locals.center = await Center.findById(req.currentUser?.center).exec();
    res.locals.currentUser = req.currentUser;
    next();
  });
}

export default configurePassport;
