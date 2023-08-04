const { addCenterFilter } = require("../db/middlewares");
const contextPlugin = require("mongoose-request-context");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DepartmentSchema = new Schema({
  name: String,
  center: {
    type: Schema.Types.ObjectId,
    ref: "Center"
  },
});

DepartmentSchema.plugin(contextPlugin, {
  contextPath: "request:user.center",
  propertyName: "center",
  contextObjectType: Schema.Types.ObjectId,
});

DepartmentSchema.plugin(addCenterFilter)

module.exports = mongoose.model("Department", DepartmentSchema);