import { addCenterFilter, capitalizeFields } from "../db/middlewares";
import contextPlugin from "mongoose-request-context";
import mongoose from "mongoose";
const { Schema } = mongoose;
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
AreaSchema.pre('save', capitalizeFields(["nom"]));
AreaSchema.plugin(contextPlugin, {
    contextPath: "request:user.center",
    propertyName: "center",
    contextObjectType: Schema.Types.ObjectId,
});
AreaSchema.plugin(addCenterFilter);
// Allow same plantas noms only across multiple centers
AreaSchema.index({ nom: 1, center: 1 }, { unique: true });
export default mongoose.model("Area", AreaSchema);
