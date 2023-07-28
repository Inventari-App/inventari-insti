const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UnitatSchema = new Schema({
  nom: String,
  planta: String,
  zona: String,
  area: String,
  responsable: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  center: {
    type: Schema.Types.ObjectId,
    ref: "Center"
  },
});

module.exports = mongoose.model("Unitat", UnitatSchema);
