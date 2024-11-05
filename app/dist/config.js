"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = configureApp;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const method_override_1 = __importDefault(require("method-override"));
const express_session_1 = __importDefault(require("express-session"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const ejs_mate_1 = __importDefault(require("ejs-mate"));
const helmet_ts_1 = __importDefault(require("./helmet.ts"));
const passport_ts_1 = __importDefault(require("./passport.ts"));
const enforceHttps_ts_1 = __importDefault(require("./utils/enforceHttps.ts"));
const flash_ts_1 = __importDefault(require("./flash.ts"));
const appRouter_ts_1 = __importDefault(require("./routers/appRouter.ts"));
const request_context_1 = __importDefault(require("request-context"));
const cors_1 = __importDefault(require("cors"));
const department_ts_1 = __importDefault(require("./models/department.ts"));
function configureApp(sessionConfig) {
    const app = (0, express_1.default)();
    // Allow CORS
    const corsOptions = {
        origin: ["http://localhost:3001", "https://controlamaterial.com"],
        methods: "GET,POST",
        credentials: true,
    };
    app.use((0, cors_1.default)(corsOptions));
    // App configuration
    app.engine("ejs", ejs_mate_1.default);
    app.set("view engine", "ejs");
    app.set("views", path_1.default.join(__dirname, "views"));
    app.use(body_parser_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, method_override_1.default)("_method"));
    app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
    app.use((0, express_mongo_sanitize_1.default)({
        replaceWith: " ",
    }));
    app.use((0, express_session_1.default)(sessionConfig));
    app.use("/utils", express_1.default.static(path_1.default.join(__dirname, "utils")));
    app.use("/public", express_1.default.static(path_1.default.join(__dirname, "public")));
    (0, enforceHttps_ts_1.default)(app);
    (0, helmet_ts_1.default)(app);
    (0, passport_ts_1.default)(app);
    (0, flash_ts_1.default)(app);
    // Save user info (centerId) on each db operation
    app.use(request_context_1.default.middleware("request"));
    // Save user context
    app.use((req, _res, next) => {
        request_context_1.default.set("request:user", req.currentUser);
        next();
    });
    // Save department context
    app.use((req, _res, next) => __awaiter(this, void 0, void 0, function* () {
        const user = req.currentUser;
        try {
            const department = yield department_ts_1.default.findById(user === null || user === void 0 ? void 0 : user.department).exec();
            request_context_1.default.set("request:department", department === null || department === void 0 ? void 0 : department.nom);
            next();
        }
        catch (_a) {
            next();
        }
    }));
    app.use((0, appRouter_ts_1.default)());
    // Middleware configuration
    // Routes configuration
    // Error handling
    return app;
}
//# sourceMappingURL=config.js.map