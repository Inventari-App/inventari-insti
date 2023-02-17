const { number } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);
const InvoiceSchema = new Schema({


    
    //albara: Array,
    invoice: Array,
    total: Number,
    
    responsable: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    timestamp: Date,
    /* 
    ,


    
    
    factura: String,
    naturalesa: String,
    tipus: String,
    num_serie: String,
    unitats_integrants: Number,
    estat: String,
    data_canvi: Date,
    num_doc_procedencia: String,
    data_incorporacio: Date,
    proveidor: String,
    objectiu: String,
    observacions: String, */

});
InvoiceSchema.plugin(AutoIncrement, {inc_field: 'numInvoice'});
module.exports = mongoose.model('Invoice', InvoiceSchema);