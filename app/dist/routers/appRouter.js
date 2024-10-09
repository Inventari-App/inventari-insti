import express from "express";
import userRoutes from "./users";
import articleRoutes from "./articles";
import invoiceRoutes from "./invoices";
import itemRoutes from "./items";
import unitatRoutes from "./unitats";
import departmentRoutes from "./departments";
import zonaRoutes from "./zonas";
import plantaRoutes from "./plantas";
import areaRoutes from "./areas";
import utilitatRoutes from "./utilitats";
import proveidorRoutes from "./proveidors";
import centreRoutes from "./centre";
import reportRoutes from "./report";
import { requireLogin } from "../middleware";
function appRouter() {
    const router = express.Router();
    router.use("/", userRoutes);
    router.use("/reports", requireLogin, reportRoutes);
    router.use("/articles", requireLogin, articleRoutes);
    router.use("/invoices", requireLogin, invoiceRoutes);
    router.use("/items", requireLogin, itemRoutes);
    router.use("/unitats", requireLogin, unitatRoutes);
    router.use("/departments", requireLogin, departmentRoutes);
    router.use("/zonas", requireLogin, zonaRoutes);
    router.use("/plantas", requireLogin, plantaRoutes);
    router.use("/areas", requireLogin, areaRoutes);
    router.use("/utilitats", requireLogin, utilitatRoutes);
    router.use("/proveidors", requireLogin, proveidorRoutes);
    router.use("/centre", requireLogin, centreRoutes);
    router.get("/", (req, res) => {
        if (req.user)
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
export default appRouter;
