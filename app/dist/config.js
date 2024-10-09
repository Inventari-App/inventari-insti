var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import path from "path";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import session from "express-session";
import mongoSanitize from "express-mongo-sanitize";
import ejsMate from "ejs-mate";
import configHelmet from "./helmet";
import configurePassport from "./passport";
import enforceHttps from "./utils/enforceHttps";
import configureFlash from "./flash";
import appRouter from "./routers/appRouter";
import contextService from "request-context";
import cors from "cors";
import Department from "./models/department";
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
    app.use(mongoSanitize({
        replaceWith: " ",
    }));
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
    app.use((req, _res, next) => {
        contextService.set("request:user", req.user);
        next();
    });
    // Save department context
    app.use((req, _res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const department = yield Department.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.department).exec();
            contextService.set("request:department", department === null || department === void 0 ? void 0 : department.nom);
            next();
        }
        catch (_b) {
            next();
        }
    }));
    app.use(appRouter());
    // Middleware configuration
    // Routes configuration
    // Error handling
    return app;
}
