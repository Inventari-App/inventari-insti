"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
require("dotenv").config({ path: __dirname + "/../.env" });
const mongoose = require("mongoose");
const dbUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lvga5.mongodb.net/inventari-insti?retryWrites=true&w=majority`;
const User = require("../models/user");
const Center = require("../models/center");
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Connected to MongoDB");
    try {
        const centers = yield Center.find();
        for (const center of centers) {
            const users = yield User.find({
                _id: [...center.users],
            });
            const centerHasNoVerifiedUsers = users.every((user) => !user.isVerified);
            const centerHasNoUsers = center.users.length === 0;
            // Delete rubbish centers
            if (centerHasNoUsers || centerHasNoVerifiedUsers) {
                console.log(`Center ${center.name} has no (verified) users - deleting...`);
                yield center.delete();
            }
            const noVerifiedUsersIds = users
                .filter((user) => !user.isVerified)
                .map((user) => user._id);
            // Delete rubbish users
            if (noVerifiedUsersIds.length) {
                yield User.deleteMany({
                    _id: [...noVerifiedUsersIds],
                });
                console.log(`\tDeleted ${noVerifiedUsersIds.length} users`);
            }
        }
    }
    catch (error) {
        console.error("Error", error);
    }
    mongoose.connection.close();
    console.log("MongoDB connection closed.");
}));
