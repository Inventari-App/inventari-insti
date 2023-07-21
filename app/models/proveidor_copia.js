const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProveidorSchema = new Schema({



    nom: String,
    responsable: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    email: {
        type: String, 
        required: true,
        unique: true   
    }


});

module.exports = mongoose.model('Proveidor', ProveidorSchema);