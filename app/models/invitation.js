const { addCenterFilter } = require("../db/middlewares");
const contextPlugin = require("mongoose-request-context");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InvitationSchema = new Schema(
  {
    email: {
      type: String,
      required: true
    },
    verificationHash: {
      type: String,
      required: true
    },
    verificationTs: {
      type: Number,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    center: {
      type: Schema.Types.ObjectId,
      ref: "Center",
    },
  },
  { timestamps: true }
);

// ItemSchema.pre('save', capitalizeFields(["nom"]))

// Allow same items in multiple centers
// InvitationSchema.index({ nom: 1, center: 1 }, { unique: true })

// InvitationSchema.plugin(contextPlugin, {
//   contextPath: "request:user.center",
//   propertyName: "center",
//   contextObjectType: Schema.Types.ObjectId,
// });

InvitationSchema.plugin(addCenterFilter)

module.exports = mongoose.model("Invitation", InvitationSchema);
