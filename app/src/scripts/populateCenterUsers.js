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
    const users = await User.find().populate("center");
    for (const user of users) {
      const { center: userCenter } = user;
      const center = await Center.findById(userCenter._id);

      if (!center.users.includes(user.id)) {
        center.users.push(user._id);
        await center.save();
        console.log(`User ${user.email} saved to center ${center.name}`);
      }
    }
  } catch (error) {
    console.error("Error pushing users to centers", error);
  }

  mongoose.connection.close();
  console.log("MongoDB connection closed.");
});
