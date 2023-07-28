const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemSchema = new Schema(
  {
    nom: String,
    imatge: Array,
    descripcio: String,
    naturalesa: String,
    tipus: String,
    responsable: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    center: {
      type: Schema.Types.ObjectId,
      ref: "Center",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", ItemSchema);