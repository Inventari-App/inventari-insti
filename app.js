const isProduction = process.env.NODE_ENV === "production"

if (!isProduction) {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const url = require('url');
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");

const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");

const userRoutes = require("./routes/users");
const articleRoutes = require("./routes/articles");
const invoiceRoutes = require("./routes/invoices");
const itemRoutes = require("./routes/items");
const unitatRoutes = require("./routes/unitats");
const zonaRoutes = require("./routes/zonas");
const plantaRoutes = require("./routes/plantas");
const areaRoutes = require("./routes/areas");
const utilitatRoutes = require("./routes/utilitats");
const proveidorRoutes = require("./routes/proveidors");
const bodyParser = require("body-parser");

const MongoDBStore = require("connect-mongo")(session);

const dbUrl = "mongodb+srv://AlbertRF147:Ruwter7h@cluster0.lvga5.mongodb.net/inventari-insti?retryWrites=true&w=majority"

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  //useCreateIndex: true,
  useUnifiedTopology: true,
  //useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);

if (isProduction) {
  // Force HTTPS
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      const secureUrl = url.format({
        protocol: 'https',
        hostname: req.hostname,
        port: app.get('port'),
        pathname: req.url
      });
  
      return res.redirect(secureUrl);
    }
  
    next();
  });
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  mongoSanitize({
    replaceWith: " ",
  })
);

const secret = process.env.SECRET || "hauriadesermillorsecret!";

const store = new MongoDBStore({
  url: dbUrl,
  secret,
  touchAfter: 24 * 60 * 60,
});

store.on("error", function (e) {
  console.log("ERROR GUARDANT SESSIÓ", e);
});

const sessionConfig = {
  store,
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());

if (isProduction) {
  const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
  ];
  //This is the array that needs added to
  const styleSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit-free.fontawesome.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
  ];
  const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
  ];
  const fontSrcUrls = [
    "https://cdn.jsdelivr.net"
  ];
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: [],
        connectSrc: ["'self'", ...connectSrcUrls],
        scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
        styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
        workerSrc: ["'self'", "blob:"],
        objectSrc: [],
        imgSrc: [
          "'self'",
          "blob:",
          "data:",
          "https://res.cloudinary.com/YOURACCOUNT/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
          "https://images.unsplash.com/",
          "https://unsplash.com/es/s/fotos/",
          "fakeimg.pl"
        ],
        fontSrc: ["'self'", ...fontSrcUrls],
      },
    })
  );
}

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.info = req.flash("info")
  res.locals.error = req.flash("error");
  next();
});

app.use("/", userRoutes);
app.use("/articles", requireLogin, articleRoutes);
app.use("/invoices", requireLogin, invoiceRoutes);
app.use("/items", requireLogin, itemRoutes);
app.use("/unitats", requireLogin, unitatRoutes);
app.use("/zonas", requireLogin, zonaRoutes);
app.use("/plantas", requireLogin, plantaRoutes);
app.use("/areas", requireLogin, areaRoutes);
app.use("/utilitats", requireLogin, utilitatRoutes);
app.use("/proveidors", requireLogin, proveidorRoutes);

app.use("/utils", express.static(path.join(__dirname, "utils")));

app.get("/", (req, res) => {
  if (req.user) return res.redirect("/invoices");
  return res.redirect('/login')
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Pàgina no trobada", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Alguna cosa ha fallat" } = err;
  if (!err.message) err.message = "Oh No, Alguna cosa ha fallat!";
  res.status(statusCode).render("error", { err });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});

function requireLogin (req, res, next) {
  if (req.user) {
    return next()
  } else {
    req.flash('error', 'Has d\'estar logat per veure la pagina.')
    res.redirect('/login')
  }
}