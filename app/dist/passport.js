var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "./models/user";
import Center from "./models/center";
function configurePassport(app) {
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
    app.use((req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        res.locals.center = yield Center.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.center).exec();
        res.locals.currentUser = req.user;
        next();
    }));
}
export default configurePassport;
