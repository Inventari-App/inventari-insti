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
