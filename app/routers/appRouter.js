const express = require("express")
const ExpressError = require("../utils/ExpressError");
const userRoutes = require("./users");
const articleRoutes = require("./articles");
const invoiceRoutes = require("./invoices");
const itemRoutes = require("./items");
const unitatRoutes = require("./unitats");
const departmentRoutes = require("./departments");
const zonaRoutes = require("./zonas");
const plantaRoutes = require("./plantas");
const areaRoutes = require("./areas");
const utilitatRoutes = require("./utilitats");
const proveidorRoutes = require("./proveidors");
const centreRoutes = require("./centre");
const reportRoutes = require("./report");
const { requireLogin } = require("../middleware");

function appRouter () {
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
    if (req.user) return res.redirect(301, "/invoices");
    return res.redirect(301, '/login')
  });

  router.get("/autoclose", (req, res) => {
    return res.render('autoclose')
  });

  router.all("*", (req, res, next) => {
    return res.render("404")
    // next(new ExpressError("Pàgina no trobada", 404));
  });

  return router
}

module.exports = appRouter
