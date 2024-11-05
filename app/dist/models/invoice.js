"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_request_context_1 = __importDefault(require("mongoose-request-context"));
const mongoose_1 = __importDefault(require("mongoose"));
const middlewares_1 = require("../db/middlewares");
const mongoose_sequence_1 = __importDefault(require("mongoose-sequence"));
const { Schema } = mongoose_1.default;
const AutoIncrement = (0, mongoose_sequence_1.default)(mongoose_1.default);
const InvoiceSchema = new Schema({
    invoiceItems: [
        {
            inventariable: Boolean,
            tipus: String,
            article: String,
            quantitat: Number,
            preu: Number,
            iva: Number,
            unitat: String,
            zona: String,
            planta: String,
            area: String,
            proveidor: String,
            subtotal: Number,
            rebuts: {
                type: Array,
                default: function () {
                    return [...Array(this.quantitat).keys()].map(() => ({
                        numSerie: "",
                        rebut: false,
                    }));
                },
            },
        },
    ],
    total: {
        type: Number,
        default: function () {
            return this.invoiceItems.reduce((acc, { subtotal }) => (acc += subtotal), 0);
        },
    },
    responsable: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    center: {
        type: Schema.Types.ObjectId,
        ref: "Center"
    },
    status: { type: String, default: "pendent" }, // pendent, aprovada, rebutjada, rebuda
    numInvoice: Number,
    comment: { type: String, default: "", maxLength: 500 }
}, { timestamps: true });
InvoiceSchema.plugin(mongoose_request_context_1.default, {
    contextPath: "request:user.center",
    propertyName: "center",
    contextObjectType: Schema.Types.ObjectId,
});
// Scoped autoincrement
InvoiceSchema.plugin(AutoIncrement, {
    id: 'numInvoice_seq',
    inc_field: 'numInvoice',
    reference_fields: ['center'],
});
InvoiceSchema.plugin(middlewares_1.addCenterFilter);
exports.default = mongoose_1.default.model("Invoice", InvoiceSchema);
//# sourceMappingURL=invoice.js.map