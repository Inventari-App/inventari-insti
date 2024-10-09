import { addCenterFilter } from "../db/middlewares";
import contextPlugin from "mongoose-request-context";
import mongoose from "mongoose";
const Schema = mongoose.Schema;
const UtilitatSchema = new Schema({
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
UtilitatSchema.plugin(contextPlugin, {
    contextPath: "request:user.center",
    propertyName: "center",
    contextObjectType: Schema.Types.ObjectId,
});
UtilitatSchema.plugin(addCenterFilter);
export default mongoose.model("Utilitat", UtilitatSchema);
