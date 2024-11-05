"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connect_flash_1 = __importDefault(require("connect-flash"));
function configureFlash(app) {
    app.use((0, connect_flash_1.default)());
    app.use((req, res, next) => {
        res.locals.success = req.flash("success");
        res.locals.info = req.flash("info");
        res.locals.error = req.flash("error");
        next();
    });
}
exports.default = configureFlash;
//# sourceMappingURL=flash.js.map