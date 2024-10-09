import contextPlugin from "mongoose-request-context";
import mongoose, { Document } from "mongoose";
import { addCenterFilter } from "../db/middlewares";
// @ts-expect-error mongoose-sequence is not typed
import AutoIncrementFactory from "mongoose-sequence";
import { ObjectId } from 'mongoose';
import { User } from "../types/models";

const { Schema } = mongoose;
const AutoIncrement = AutoIncrementFactory(mongoose);

export interface Rebut {
  numSerie: string;
  rebut: boolean;
}

export interface InvoiceItem {
  inventariable: boolean;
  tipus: string;
  article: string;
  quantitat: number;
  preu: number;
  iva: number;
  unitat: string;
  zona: string;
  planta: string;
  area: string;
  proveidor: string;
  subtotal: number;
  rebuts: Rebut[];
}

export interface Invoice extends Document {
  invoiceItems: InvoiceItem[];
  total: number;
  responsable: User;
  center: ObjectId;
  status: string; // pendent, aprovada, rebutjada, rebuda
  numInvoice: number;
  comment: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const InvoiceSchema = new Schema(
  {
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
          default: function (this: InvoiceItem): Rebut[] {
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
      default: function (this: Invoice) {
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
    center: {
      type: Schema.Types.ObjectId,
      ref: "Center"
    },
    status: { type: String, default: "pendent" }, // pendent, aprovada, rebutjada, rebuda
    numInvoice: Number,
    comment: { type: String, default: "", maxLength: 500 }
  },
  { timestamps: true }
);

InvoiceSchema.plugin(contextPlugin, {
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

InvoiceSchema.plugin(addCenterFilter);

export default mongoose.model("Invoice", InvoiceSchema);

