"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_request_context_1 = __importDefault(require("mongoose-request-context"));
const mongoose_1 = __importDefault(require("mongoose"));
const middlewares_1 = require("../db/middlewares");
const { Schema } = mongoose_1.default;
const ArticleSchema = new Schema({
    article: String,
    preu: Number,
    iva: Number,
    proveidor: String,
    unitat: String,
    descripcio: String,
    numSerie: { type: String, default: "" },
    responsable: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    department: String,
    center: {
        type: Schema.Types.ObjectId,
        ref: "Center",
    },
}, { timestamps: true });
ArticleSchema.plugin(mongoose_request_context_1.default, {
    contextPath: "request:user.center",
    propertyName: "center",
    contextObjectType: Schema.Types.ObjectId,
});
ArticleSchema.plugin(middlewares_1.addCenterFilter);
ArticleSchema.plugin(middlewares_1.addDepartmentScope);
ArticleSchema.plugin(middlewares_1.addResponsable);
exports.default = mongoose_1.default.model("Article", ArticleSchema);
//# sourceMappingURL=article.js.map