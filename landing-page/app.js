const express = require('express');
const cookieParser = require('cookie-parser')
const engine = require("ejs-mate")
const bodyParser = require("body-parser");
const path = require('path');
const mainController = require('./controllers/mainController');
const verifyPassword = require('./helpers/verifyPassword');

const app = express();
const port = process.env.PORT || 3001;

// Set up EJS view engine
app.engine('ejs', engine)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser())

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(verifyAuthCookie)

// Routes
app.get('/', mainController.index);
app.get('/login', mainController.login);
app.post('/loginVerify', mainController.loginVerify);

app.all("*", (req, res, next) => {
  return res.render('error')
  // next(new ExpressError("Pàgina no trobada", 404));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

function verifyAuthCookie (req, res, next) {
  const cookies = req.cookies
  if (cookies.secret && verifyPassword(cookies.secret)) {
    next()
  } else {
    if (req.path === "/login" || req.path === "/loginVerify") {
      next()
    } else {
      res.redirect("/login")
    }
  }
}
