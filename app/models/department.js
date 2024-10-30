const { addCenterFilter, capitalizeFields } = require("../db/middlewares");
const contextPlugin = require("mongoose-request-context");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DepartmentSchema = new Schema({
  nom: String,
  center: {
    type: Schema.Types.ObjectId,
    ref: "Center"
  },
});

// DepartmentSchema.pre('save', capitalizeFields(["nom"]))

DepartmentSchema.plugin(contextPlugin, {
  contextPath: "request:user.center",
  propertyName: "center",
  contextObjectType: Schema.Types.ObjectId,
});

DepartmentSchema.plugin(addCenterFilter)

// Allow same unitats in multiple centers
DepartmentSchema.index({ nom: 1, center: 1 }, { unique: true })

module.exports = mongoose.model("Department", DepartmentSchema);
