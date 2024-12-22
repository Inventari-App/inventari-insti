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
const contextService = require("request-context")
const cors = require("cors");
const Department = require("./models/department");

if (!isProduction) {
  require("dotenv").config();
}

function configureApp(sessionConfig) {
  const app = express();

  // Allow CORS
  const corsOptions = {
    origin: ["http://localhost:3001", "http://localhost:5173", "https://controlamaterial.com"],
    methods: "GET,POST",
    credentials: true,
  }
  app.use(cors(corsOptions))

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
  app.use("/public", express.static(path.join(__dirname, "public")));

  enforceHttps(app)
  configHelmet(app)
  configurePassport(app)
  configureFlash(app)

  // Save user info (centerId) on each db operation
  app.use(contextService.middleware('request'))
  // Save user context
  app.use((req, res, next) => {
    contextService.set('request:user', req.user)
    next()
  })
  // Save department context
  app.use(async (req, res, next) => {
    try {
      const department = await Department.findById(req.user.department).exec()
      contextService.set('request:department', department?.nom)
      next()
    } catch (e) {
      next()
    }
  })

  app.use(appRouter())

  // Middleware configuration

  // Routes configuration

  // Error handling

  return app;
}

module.exports = configureApp;
