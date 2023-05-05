const { number } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);
const InvoiceSchema = new Schema(
  {
    invoiceItems: [
      {
        naturalesa: String,
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
        rebuts: { type: Array, default: function () {
            return [...Array(this.quantitat).keys()].map(() => ({
                numSerie: "",
                rebut: false,
            }))
        }}
      },
    ],
    total: {
      type: Number,
      default: function () {
        return this.invoiceItems.reduce(
          (acc, { subtotal }) => (acc += subtotal),
          0
        );
      },
    },

    responsable: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    status: { type: String, default: "pendent" }, // pendent, aprovada, rebutjada, rebuda
  },
  { timestamps: true }
);
InvoiceSchema.plugin(AutoIncrement, { inc_field: "numInvoice" });
module.exports = mongoose.model("Invoice", InvoiceSchema);
