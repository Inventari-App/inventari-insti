"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const middlewares_1 = require("../db/middlewares");
const mongoose_request_context_1 = __importDefault(require("mongoose-request-context"));
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const AreaSchema = new Schema({
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
AreaSchema.pre('save', (0, middlewares_1.capitalizeFields)(["nom"]));
AreaSchema.plugin(mongoose_request_context_1.default, {
    contextPath: "request:user.center",
    propertyName: "center",
    contextObjectType: Schema.Types.ObjectId,
});
AreaSchema.plugin(middlewares_1.addCenterFilter);
// Allow same plantas noms only across multiple centers
AreaSchema.index({ nom: 1, center: 1 }, { unique: true });
exports.default = mongoose_1.default.model("Area", AreaSchema);
//# sourceMappingURL=area.js.map