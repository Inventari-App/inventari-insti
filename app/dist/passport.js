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
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const user_1 = __importDefault(require("./models/user"));
const center_1 = __importDefault(require("./models/center"));
function configurePassport(app) {
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
    passport_1.default.use(new passport_local_1.Strategy(user_1.default.authenticate()));
    passport_1.default.serializeUser(user_1.default.serializeUser());
    passport_1.default.deserializeUser(user_1.default.deserializeUser());
    app.use((req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        res.locals.center = yield center_1.default.findById((_a = req.currentUser) === null || _a === void 0 ? void 0 : _a.center).exec();
        res.locals.currentUser = req.currentUser;
        next();
    }));
}
exports.default = configurePassport;
//# sourceMappingURL=passport.js.map