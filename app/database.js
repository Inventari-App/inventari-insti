const session = require("express-session");
const MongoDBStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const { isProduction } = require("./utils/helpers");
const dbUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lvga5.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
const secret = process.env.SECRET
const db = mongoose.connection;
const store = new MongoDBStore({
  url: dbUrl,
  secret,
  touchAfter: 24 * 60 * 60,
});

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  //useCreateIndex: true,
  useUnifiedTopology: true,
  //useFindAndModify: false
});

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
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
    secure: isProduction,
  },
};

module.exports = sessionConfig
