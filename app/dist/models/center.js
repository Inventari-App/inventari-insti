"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const middlewares_1 = require("../db/middlewares");
const Schema = mongoose_1.default.Schema;
const CenterSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});
CenterSchema.pre('save', (0, middlewares_1.capitalizeFields)(["name"]));
exports.default = mongoose_1.default.model("Center", CenterSchema);
//# sourceMappingURL=center.js.map