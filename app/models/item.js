const { addCenterFilter } = require("../db/middlewares");
const contextPlugin = require("mongoose-request-context");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemSchema = new Schema(
  {
    nom: String,
    imatge: Array,
    descripcio: String,
    inventariable: Boolean,
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

ItemSchema.plugin(contextPlugin, {
  contextPath: "request:user.center",
  propertyName: "center",
  contextObjectType: Schema.Types.ObjectId,
});

ItemSchema.plugin(addCenterFilter)

module.exports = mongoose.model("Item", ItemSchema);
