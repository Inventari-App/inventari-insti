"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const middlewares_1 = require("../db/middlewares");
const mongoose_request_context_1 = __importDefault(require("mongoose-request-context"));
const mongoose_1 = __importDefault(require("mongoose"));
const passport_local_mongoose_1 = __importDefault(require("passport-local-mongoose"));
const { Schema } = mongoose_1.default;
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
UserSchema.plugin(mongoose_request_context_1.default, {
    contextPath: "request:user.center",
    propertyName: "center",
    contextObjectType: Schema.Types.ObjectId,
});
UserSchema.plugin(passport_local_mongoose_1.default, { populateFields: "center" });
UserSchema.plugin(middlewares_1.addCenterFilter);
exports.default = mongoose_1.default.model("User", UserSchema);
//# sourceMappingURL=user.js.map