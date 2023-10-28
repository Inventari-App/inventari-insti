const contextPlugin = require("mongoose-request-context");
const mongoose = require("mongoose");
const { addCenterFilter } = require("../db/middlewares");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  article: String,
  preu: Number,
  iva: Number,
  inventariable: Boolean,
  proveidor: String,
  tipus: String,
  unitat: String,
  descripcio: String,
  numSerie: { type: String, default: '' },
  responsable: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  center: {
    type: Schema.Types.ObjectId,
    ref: "Center"
  },
}, { timestamps: true });

ArticleSchema.plugin(contextPlugin, {
  contextPath: "request:user.center",
  propertyName: "center",
  contextObjectType: Schema.Types.ObjectId,
});

ArticleSchema.plugin(addCenterFilter)

module.exports = mongoose.model("Article", ArticleSchema);
