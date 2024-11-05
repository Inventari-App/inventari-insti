"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const middlewares_1 = require("../db/middlewares");
const mongoose_request_context_1 = __importDefault(require("mongoose-request-context"));
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
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
PlantaSchema.pre('save', (0, middlewares_1.capitalizeFields)(["nom"]));
PlantaSchema.plugin(mongoose_request_context_1.default, {
    contextPath: "request:user.center",
    propertyName: "center",
    contextObjectType: Schema.Types.ObjectId,
});
PlantaSchema.plugin(middlewares_1.addCenterFilter);
// Allow same plantas noms only across multiple centers
PlantaSchema.index({ nom: 1, center: 1 }, { unique: true });
exports.default = mongoose_1.default.model("Planta", PlantaSchema);
//# sourceMappingURL=planta.js.map