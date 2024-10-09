import contextPlugin from "mongoose-request-context";
import mongoose from "mongoose";
import { addCenterFilter, addResponsable, addDepartmentScope } from "../db/middlewares";
const { Schema } = mongoose;
const ArticleSchema = new Schema({
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
}, { timestamps: true });
ArticleSchema.plugin(contextPlugin, {
    contextPath: "request:user.center",
    propertyName: "center",
    contextObjectType: Schema.Types.ObjectId,
});
ArticleSchema.plugin(addCenterFilter);
ArticleSchema.plugin(addDepartmentScope);
ArticleSchema.plugin(addResponsable);
export default mongoose.model("Article", ArticleSchema);
