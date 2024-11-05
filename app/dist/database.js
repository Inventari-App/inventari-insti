"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts_dotenv_1 = require("ts-dotenv");
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const mongoose_1 = __importDefault(require("mongoose"));
const helpers_ts_1 = require("./utils/helpers.ts");
const env = (0, ts_dotenv_1.load)({
    SECRET: String,
    DB_USER: String,
    DB_PASS: String,
    DB_NAME: String,
});
const MongoDBStore = (0, connect_mongo_1.default)(express_session_1.default);
const dbUrl = `mongodb+srv://${env.DB_USER}:${env.DB_PASS}@cluster0.lvga5.mongodb.net/${env.DB_NAME}?retryWrites=true&w=majority`;
const secret = env.SECRET;
const db = mongoose_1.default.connection;
const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60,
});
mongoose_1.default.connect(dbUrl);
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
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        maxAge: 1000 * 60 * 60 * 24 * 7,
        secure: helpers_ts_1.isProduction,
    },
};
exports.default = sessionConfig;
//# sourceMappingURL=database.js.map