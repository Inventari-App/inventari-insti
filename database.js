const session = require("express-session");
const MongoDBStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const dbUrl = "mongodb+srv://AlbertRF147:Ruwter7h@cluster0.lvga5.mongodb.net/inventari-insti?retryWrites=true&w=majority"
const secret = process.env.SECRET || "hauriadesermillorsecret!";
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
  },
};

module.exports = sessionConfig