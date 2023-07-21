const path = require('path');

exports.index = (req, res) => {
  // Assuming you already have the view code in views/index.ejs
  res.render('index');
};
