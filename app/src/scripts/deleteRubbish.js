import { load } from 'ts-dotenv';

import mongoose from "mongoose";
import User from "../models/user";
import Center from "../models/center";

const env = load({
  DB_USER: String,
  DB_PASS: String,
  DB_NAME: String,
})

const dbUrl = `mongodb+srv://${env.DB_USER}:${env.DB_PASS}@cluster0.lvga5.mongodb.net/${env.DB_NAME}?retryWrites=true&w=majority`;

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", async () => {
  console.log("Connected to MongoDB");

  try {
    const centers = await Center.find();
    for (const center of centers) {
      const users = await User.find({
        _id: [...center.users],
      });
      const centerHasNoVerifiedUsers = users.every((user) => !user.isVerified);
      const centerHasNoUsers = center.users.length === 0;

      // Delete rubbish centers
      if (centerHasNoUsers || centerHasNoVerifiedUsers) {
        console.log(
          `Center ${center.name} has no (verified) users - deleting...`,
        );
        await center.delete();
      }

      const noVerifiedUsersIds = users
        .filter((user) => !user.isVerified)
        .map((user) => user._id);

      // Delete rubbish users
      if (noVerifiedUsersIds.length) {
        await User.deleteMany({
          _id: [...noVerifiedUsersIds],
        });
        console.log(`\tDeleted ${noVerifiedUsersIds.length} users`);
      }
    }
  } catch (error) {
    console.error("Error", error);
  }

  mongoose.connection.close();
  console.log("MongoDB connection closed.");
});

