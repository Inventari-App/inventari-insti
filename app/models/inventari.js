const contextPlugin = require("mongoose-request-context");
const mongoose = require("mongoose");
const { addCenterFilter, addResponsable } = require("../db/middlewares");
const Schema = mongoose.Schema;

const InventariSchema = new Schema(
  {
    article: String,
    preu: Number,
    iva: Number,
    proveidor: String,
    unitat: String,
    descripcio: String,
    numSerie: { type: String, default: "" },
    responsable: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    department: String,
    center: {
      type: Schema.Types.ObjectId,
      ref: "Center",
    },
  },
  { timestamps: true },
);

InventariSchema.plugin(contextPlugin, {
  contextPath: "request:user.center",
  propertyName: "center",
  contextObjectType: Schema.Types.ObjectId,
});

InventariSchema.plugin(addCenterFilter);

InventariSchema.plugin(addResponsable);

module.exports = mongoose.model("Inventari", InventariSchema);
