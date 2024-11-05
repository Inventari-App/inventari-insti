"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const middlewares_1 = require("../db/middlewares");
const mongoose_request_context_1 = __importDefault(require("mongoose-request-context"));
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const UnitatSchema = new Schema({
    nom: {
        type: String,
        required: true,
    },
    planta: String,
    zona: String,
    area: String,
    responsable: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    center: {
        type: Schema.Types.ObjectId,
        ref: "Center"
    },
});
UnitatSchema.pre('save', (0, middlewares_1.capitalizeFields)(["nom"]));
UnitatSchema.plugin(mongoose_request_context_1.default, {
    contextPath: "request:user.center",
    propertyName: "center",
    contextObjectType: Schema.Types.ObjectId,
});
UnitatSchema.plugin(middlewares_1.addCenterFilter);
// Allow same unitat noms only across multiple centers
UnitatSchema.index({ nom: 1, center: 1 }, { unique: true });
exports.default = mongoose_1.default.model("Unitat", UnitatSchema);
//# sourceMappingURL=unitat.js.map