const isProduction = process.env.NODE_ENV === "prod"

exports.index = (req, res) => {
  // Assuming you already have the view code in views/index.ejs
  res.render('index', { appTargetUrl: isProduction ? "https://app.controlamaterial.com" : "http://localhost:3000" });
};
