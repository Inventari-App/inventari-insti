import { load } from 'ts-dotenv';
import session from "express-session";
import connectMongo from "connect-mongo";
import mongoose from "mongoose";
import { isProduction } from "./utils/helpers";

export interface SessionConfig {
  store: any;
  name: string;
  secret: string;
  resave: boolean;
  saveUninitialized: boolean;
  cookie: {
    httpOnly: boolean;
    expires: Date;
    maxAge: number;
    secure: boolean;
  };
}

const env = load({
  SECRET: String,
  DB_USER: String,
  DB_PASS: String,
  DB_NAME: String,
})

const MongoDBStore = connectMongo(session);
const dbUrl = `mongodb+srv://${env.DB_USER}:${env.DB_PASS}@cluster0.lvga5.mongodb.net/${env.DB_NAME}?retryWrites=true&w=majority`;
const secret = env.SECRET;
const db = mongoose.connection;

const store = new MongoDBStore({
  url: dbUrl,
  secret,
  touchAfter: 24 * 60 * 60,
});

mongoose.connect(dbUrl);

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

store.on("error", function (e) {
  console.log("ERROR GUARDANT SESSIÓ", e);
});

const sessionConfig: SessionConfig = {
  store,
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    maxAge: 1000 * 60 * 60 * 24 * 7,
    secure: isProduction,
  },
};

export default sessionConfig;

