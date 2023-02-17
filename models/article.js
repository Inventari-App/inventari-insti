const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({


    
    nom: String,
    preu: Number,
    unitat: String,
    imatge: Array,
    descripcio: String,
    //albara: Array,
    //proforma: Array,
    responsable: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
    /* 
    ,


    matricula: [
        {username: String},
        {zona: String},
        {planta: String},
        {area: String},
        {unitat: String}
    ] */

    /* proforma: String,
    comanda: String,
    albara: String,
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

module.exports = mongoose.model('Article', ArticleSchema);