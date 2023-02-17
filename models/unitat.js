const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UnitatSchema = new Schema({


    
    nom: String,
    //preu: Number,
    //unitat: String,
    //imatge: Array,
    planta: String,
    zona: String,
    area: String,

    responsable: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
    
    /* proforma: String,
    comanda: String,
    albara: String,
    factura: String,
    
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

module.exports = mongoose.model('Unitat', UnitatSchema);