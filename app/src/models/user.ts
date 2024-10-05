import { addCenterFilter } from "../db/middlewares";
import contextPlugin from "mongoose-request-context";
import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: "Department",
  },
  center: {
    type: Schema.Types.ObjectId,
    ref: "Center",
  },
  isAdmin: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  verificationHash: { type: String },
  verificationTs: { type: Number },
  resetPasswordHash: { type: String },
  resetPasswordTs: { type: Number },
});

// This logic is to replace username by email for loging in the app
UserSchema.pre("save", function (next) {
  // Check if username is not set or is an empty string
  if (!this.username || this.username.trim() === "") {
    this.username = this.email; // Copy email to username
  }

  // Continue with the save operation
  next();
});

UserSchema.plugin(contextPlugin, {
  contextPath: "request:user.center",
  propertyName: "center",
  contextObjectType: Schema.Types.ObjectId,
});

UserSchema.plugin(passportLocalMongoose, { populateFields: "center" });

UserSchema.plugin(addCenterFilter);

export default mongoose.model("User", UserSchema);
