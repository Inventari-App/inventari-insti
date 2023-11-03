const { addCenterFilter } = require("../db/middlewares");
const contextPlugin = require("mongoose-request-context");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UnitatSchema = new Schema({
  nom: {
    type: String,
    unique: true,
    required: true,
  },
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

UnitatSchema.plugin(contextPlugin, {
  contextPath: "request:user.center",
  propertyName: "center",
  contextObjectType: Schema.Types.ObjectId,
});

UnitatSchema.plugin(addCenterFilter)

module.exports = mongoose.model("Unitat", UnitatSchema);
