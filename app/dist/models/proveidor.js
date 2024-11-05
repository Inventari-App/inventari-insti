"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const middlewares_1 = require("../db/middlewares");
const mongoose_request_context_1 = __importDefault(require("mongoose-request-context"));
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
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
ProveidorSchema.pre('save', (0, middlewares_1.capitalizeFields)(["nom"]));
ProveidorSchema.plugin(mongoose_request_context_1.default, {
    contextPath: "request:user.center",
    propertyName: "center",
    contextObjectType: Schema.Types.ObjectId,
});
ProveidorSchema.plugin(middlewares_1.addCenterFilter);
// Allow same proveidors in multiple centers
ProveidorSchema.index({ nom: 1, center: 1 }, { unique: true });
exports.default = mongoose_1.default.model("Proveidor", ProveidorSchema);
//# sourceMappingURL=proveidor.js.map