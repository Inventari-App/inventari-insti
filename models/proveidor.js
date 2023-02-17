const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const ProveidorSchema = new Schema({
        
    nom: {
        type: String,
        required: true,
        unique: true
    },

    responsable: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    cif: {
        type: String,
        required: true,
        unique: true
    },

    adreca: {
        type: String,
        required: true,
        
    },

    telefon: {
        type: String,
        required: true,
        
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

});


module.exports = mongoose.model('Proveidor', ProveidorSchema);