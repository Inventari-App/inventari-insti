"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = __importDefault(require("./users"));
const articles_1 = __importDefault(require("./articles"));
const invoices_1 = __importDefault(require("./invoices"));
const items_1 = __importDefault(require("./items"));
const unitats_1 = __importDefault(require("./unitats"));
const departments_1 = __importDefault(require("./departments"));
const zonas_1 = __importDefault(require("./zonas"));
const plantas_1 = __importDefault(require("./plantas"));
const areas_1 = __importDefault(require("./areas"));
const utilitats_1 = __importDefault(require("./utilitats"));
const proveidors_1 = __importDefault(require("./proveidors"));
const centre_1 = __importDefault(require("./centre"));
const report_1 = __importDefault(require("./report"));
const middleware_1 = require("../middleware");
function appRouter() {
    const router = express_1.default.Router();
    router.use("/", users_1.default);
    router.use("/reports", middleware_1.requireLogin, report_1.default);
    router.use("/articles", middleware_1.requireLogin, articles_1.default);
    router.use("/invoices", middleware_1.requireLogin, invoices_1.default);
    router.use("/items", middleware_1.requireLogin, items_1.default);
    router.use("/unitats", middleware_1.requireLogin, unitats_1.default);
    router.use("/departments", middleware_1.requireLogin, departments_1.default);
    router.use("/zonas", middleware_1.requireLogin, zonas_1.default);
    router.use("/plantas", middleware_1.requireLogin, plantas_1.default);
    router.use("/areas", middleware_1.requireLogin, areas_1.default);
    router.use("/utilitats", middleware_1.requireLogin, utilitats_1.default);
    router.use("/proveidors", middleware_1.requireLogin, proveidors_1.default);
    router.use("/centre", middleware_1.requireLogin, centre_1.default);
    router.get("/", (req, res) => {
        if (req.currentUser)
            return res.redirect(301, "/invoices");
        return res.redirect(301, '/login');
    });
    router.get("/autoclose", (_req, res) => {
        return res.render('autoclose');
    });
    router.all("*", (_req, res) => {
        return res.render("404");
        // next(new ExpressError("Pàgina no trobada", 404));
    });
    return router;
}
exports.default = appRouter;
//# sourceMappingURL=appRouter.js.map