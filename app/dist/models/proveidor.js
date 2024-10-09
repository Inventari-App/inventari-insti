import { addCenterFilter, capitalizeFields } from "../db/middlewares";
import contextPlugin from "mongoose-request-context";
import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ProveidorSchema = new Schema({
    nom: {
        type: String,
        required: true,
        // unique: true,
    },
    responsable: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    cif: {
        type: String,
        // unique: true,
    },
    adreca: {
        type: String,
    },
    telefon: {
        type: String,
    },
    email: {
        type: String,
        // unique: true,
    },
    center: {
        type: Schema.Types.ObjectId,
        ref: "Center"
    },
});
ProveidorSchema.pre('save', capitalizeFields(["nom"]));
ProveidorSchema.plugin(contextPlugin, {
    contextPath: "request:user.center",
    propertyName: "center",
    contextObjectType: Schema.Types.ObjectId,
});
ProveidorSchema.plugin(addCenterFilter);
// Allow same proveidors in multiple centers
ProveidorSchema.index({ nom: 1, center: 1 }, { unique: true });
export default mongoose.model("Proveidor", ProveidorSchema);
