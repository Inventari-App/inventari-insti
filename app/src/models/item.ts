import { addCenterFilter, capitalizeFields } from "../db/middlewares";
import contextPlugin from "mongoose-request-context";
import mongoose from "mongoose";

const { Schema } = mongoose;

const ItemSchema = new Schema(
  {
    nom: {
      type: String,
      required: true
    },
    imatge: Array,
    descripcio: String,
    inventariable: Boolean,
    tipus: String,
    responsable: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    center: {
      type: Schema.Types.ObjectId,
      ref: "Center",
    },
  },
  { timestamps: true }
);

ItemSchema.pre('save', capitalizeFields(["nom"]));

// Allow same items in multiple centers
ItemSchema.index({ nom: 1, center: 1 }, { unique: true });

ItemSchema.plugin(contextPlugin, {
  contextPath: "request:user.center",
  propertyName: "center",
  contextObjectType: Schema.Types.ObjectId,
});

ItemSchema.plugin(addCenterFilter);

export default mongoose.model("Item", ItemSchema);

