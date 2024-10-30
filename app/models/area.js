const { addCenterFilter, capitalizeFields } = require("../db/middlewares");
const contextPlugin = require("mongoose-request-context");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AreaSchema = new Schema({
  nom: String,
  responsable: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  center: {
    type: Schema.Types.ObjectId,
    ref: "Center"
  },
});

// AreaSchema.pre('save', capitalizeFields(["nom"]))

AreaSchema.plugin(contextPlugin, {
  contextPath: "request:user.center",
  propertyName: "center",
  contextObjectType: Schema.Types.ObjectId,
});

AreaSchema.plugin(addCenterFilter)

// Allow same plantas noms only across multiple centers
AreaSchema.index({ nom: 1, center: 1 }, { unique: true })

module.exports = mongoose.model("Area", AreaSchema);
