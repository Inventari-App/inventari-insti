const contextPlugin = require("mongoose-request-context");
const mongoose = require("mongoose");
const { addCenterFilter, addResponsable, addDepartmentScope } = require("../db/middlewares");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema(
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

ArticleSchema.plugin(contextPlugin, {
  contextPath: "request:user.center",
  propertyName: "center",
  contextObjectType: Schema.Types.ObjectId,
});

ArticleSchema.plugin(addCenterFilter);

ArticleSchema.plugin(addDepartmentScope);

ArticleSchema.plugin(addResponsable);

module.exports = mongoose.model("Article", ArticleSchema);
