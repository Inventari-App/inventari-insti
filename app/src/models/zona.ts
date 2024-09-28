import { addCenterFilter, capitalizeFields } from "../db/middlewares";
import contextPlugin from "mongoose-request-context";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ZonaSchema = new Schema({
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

ZonaSchema.pre('save', capitalizeFields(["nom"]))

ZonaSchema.plugin(contextPlugin, {
  contextPath: "request:user.center",
  propertyName: "center",
  contextObjectType: Schema.Types.ObjectId,
});

ZonaSchema.plugin(addCenterFilter)

// Allow same zonas noms only across multiple centers
ZonaSchema.index({ nom: 1, center: 1 }, { unique: true })

export default mongoose.model("Zona", ZonaSchema);
