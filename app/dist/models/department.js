import { addCenterFilter, capitalizeFields } from "../db/middlewares";
import contextPlugin from "mongoose-request-context";
import mongoose from "mongoose";
const { Schema } = mongoose;
const DepartmentSchema = new Schema({
    nom: String,
    center: {
        type: Schema.Types.ObjectId,
        ref: "Center"
    },
});
DepartmentSchema.pre('save', capitalizeFields(["nom"]));
DepartmentSchema.plugin(contextPlugin, {
    contextPath: "request:user.center",
    propertyName: "center",
    contextObjectType: Schema.Types.ObjectId,
});
DepartmentSchema.plugin(addCenterFilter);
// Allow same unitats in multiple centers
DepartmentSchema.index({ nom: 1, center: 1 }, { unique: true });
export default mongoose.model("Department", DepartmentSchema);
