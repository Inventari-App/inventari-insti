const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CenterSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Center", CenterSchema);
