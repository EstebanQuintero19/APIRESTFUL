const mongoose = require('../config/db')

const schemaCliente = new mongoose.Schema({
    documento: {
        type: String,
        minlength: [7,"El documento debe tener al menos 7 caracteres"],
        maxlength: [10,"el documento debe tener como máximo 10 caracteres"],
        required: true,
        unique: true
    },
    nombreCompleto: {
        type: String,
        required: true,
        maxlength: 150
    },
    fechaNacimiento: {
        type: Date,
        required: true
    }
}, {
    versionKey: false
});


const clientes = mongoose.model('clientes', schemaCliente);
module.exports = clientes;

