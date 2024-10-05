import flash from "connect-flash";
import { Express } from "express";

function configureFlash(app: Express) {
  app.use(flash());
  app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.info = req.flash("info");
    res.locals.error = req.flash("error");
    next();
  });
}

export default configureFlash;

