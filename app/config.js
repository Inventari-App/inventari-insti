const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const session = require("express-session");
const mongoSanitize = require("express-mongo-sanitize");
const { isProduction } = require("./utils/helpers")
const ejsMate = require("ejs-mate");
const configHelmet = require("./helmet");
const configurePassport = require("./passport");
const enforceHttps = require("./utils/enforceHttps");
const configureFlash = require("./flash");
const appRouter = require("./routers/appRouter");
const { handleRouteError } = require("./middleware");

if (!isProduction) {
  require("dotenv").config();
}

function configureApp(sessionConfig) {
  const app = express();

  // App configuration
  app.engine("ejs", ejsMate);
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));

  app.use(bodyParser.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(methodOverride("_method"));
  app.use(express.static(path.join(__dirname, "public")));
  app.use(
    mongoSanitize({
      replaceWith: " ",
    })
  );
  app.use(session(sessionConfig));
  app.use("/utils", express.static(path.join(__dirname, "utils")));
  app.use(handleRouteError)

  enforceHttps(app)
  configHelmet(app)
  configurePassport(app)
  configureFlash(app)

  app.use(appRouter())

  // Middleware configuration

  // Routes configuration

  // Error handling

  return app;
}

module.exports = configureApp;
