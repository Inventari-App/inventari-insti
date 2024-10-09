import express from "express";
import path from "path";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import session from "express-session";
import mongoSanitize from "express-mongo-sanitize";
import { isProduction } from "./utils/helpers";
import ejsMate from "ejs-mate";
import configHelmet from "./helmet";
import configurePassport from "./passport";
import enforceHttps from "./utils/enforceHttps";
import configureFlash from "./flash";
import appRouter from "./routers/appRouter";
import contextService from "request-context";
import cors from "cors";
import Department from "./models/department";

if (!isProduction) {
  require("dotenv").config();
}

export default function configureApp(sessionConfig) {
  const app = express();

  // Allow CORS
  const corsOptions = {
    origin: ["http://localhost:3001", "https://controlamaterial.com"],
    methods: "GET,POST",
    credentials: true,
  };
  app.use(cors(corsOptions));

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

  enforceHttps(app);
  configHelmet(app);
  configurePassport(app);
  configureFlash(app);

  // Save user info (centerId) on each db operation
  app.use(contextService.middleware("request"));
  // Save user context
  app.use((req, res, next) => {
    contextService.set("request:user", req.user);
    next();
  });
  // Save department context
  app.use(async (req, res, next) => {
    try {
      const department = await Department.findById(req.user?.department).exec();
      contextService.set("request:department", department?.nom);
      next();
    } catch (e) {
      next();
    }
  });

  app.use(appRouter());

  // Middleware configuration

  // Routes configuration

  // Error handling

  return app;
}

