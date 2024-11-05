"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const middlewares_1 = require("../db/middlewares");
const mongoose_request_context_1 = __importDefault(require("mongoose-request-context"));
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const ItemSchema = new Schema({
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
}, { timestamps: true });
ItemSchema.pre('save', (0, middlewares_1.capitalizeFields)(["nom"]));
// Allow same items in multiple centers
ItemSchema.index({ nom: 1, center: 1 }, { unique: true });
ItemSchema.plugin(mongoose_request_context_1.default, {
    contextPath: "request:user.center",
    propertyName: "center",
    contextObjectType: Schema.Types.ObjectId,
});
ItemSchema.plugin(middlewares_1.addCenterFilter);
exports.default = mongoose_1.default.model("Item", ItemSchema);
//# sourceMappingURL=item.js.map