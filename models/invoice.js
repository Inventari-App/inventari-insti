const { number } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);
const InvoiceSchema = new Schema({
    invoiceItems: [{
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
    }],
    total: {
        type: Number,
        default: function() {
            return this.invoiceItems.reduce((acc, { subtotal }) => acc += subtotal, 0)
        }
    },
    
    responsable: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    /* 
    ,
    
    <input type="hidden" class="tr<%=i%>" id="naturalesaInputTr<%=i%>" value=" <%= linia[0] %>">
    <input type="hidden" class="tr<%=i%>" id="tipusInputTr<%=i%>" value="<%= linia[1] %>">
    <input type="hidden" class="tr<%=i%>" id="articleInputTr<%=i%>" value="<%= linia[2] %>">
    <input type="hidden" class="tr<%=i%>" id="quantitatInputTr<%=i%>" value="<%= linia[3] %>">
    <input type="hidden" class="tr<%=i%>" id="preuInputTr<%=i%>" value="<%= linia[4] %>">
    <input type="hidden" class="tr<%=i%>" id="ivaInputTr<%=i%>" value="<%= linia[5] %>">
    <input type="hidden" class="tr<%=i%>" id="unitatInputTr<%=i%>" value="<%= linia[6] %>">
    <input type="hidden" class="tr<%=i%>" id="zonaInputTr<%=i%>" value="<%= linia[7] %>">
    <input type="hidden" class="tr<%=i%>" id="plantaInputTr<%=i%>" value="<%= linia[8] %>">
    <input type="hidden" class="tr<%=i%>" id="areaInputTr<%=i%>" value="<%= linia[9] %>">
    <input type="hidden" class="tr<%=i%>" id="proveidorInputTr<%=i%>" value="<%= linia[10] %>">
    <input type="hidden" class="tr<%=i%>" id="subtotalInputTr<%=i%>" value="<%= (linia[3]*linia[4]*(1+linia[5]/100))%>">

    
    
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

}, { timestamps: true });
InvoiceSchema.plugin(AutoIncrement, {inc_field: 'numInvoice'});
module.exports = mongoose.model('Invoice', InvoiceSchema);
