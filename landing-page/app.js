const express = require('express');
const path = require('path');
const mainController = require('./controllers/mainController');

const app = express();
const port = process.env.PORT || 3001;

// Set up EJS view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));
// Routes
app.get('/', mainController.index);

app.all("*", (req, res, next) => {
  return res.render('error')
  // next(new ExpressError("Pàgina no trobada", 404));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
