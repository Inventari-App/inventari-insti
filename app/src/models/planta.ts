import { addCenterFilter, capitalizeFields } from "../db/middlewares";
import contextPlugin from "mongoose-request-context";
import mongoose from "mongoose";
const { Schema } = mongoose;

const PlantaSchema = new Schema({
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

PlantaSchema.pre('save', capitalizeFields(["nom"]));

PlantaSchema.plugin(contextPlugin, {

  contextPath: "request:user.center",
  propertyName: "center",
  contextObjectType: Schema.Types.ObjectId,
});

PlantaSchema.plugin(addCenterFilter);

// Allow same plantas noms only across multiple centers
PlantaSchema.index({ nom: 1, center: 1 }, { unique: true });

export default mongoose.model("Planta", PlantaSchema);

