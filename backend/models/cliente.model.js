const mongoose = require('../config/db')

const schemaCliente = new mongoose.Schema({
    documento:{
        type: String,
        minLenghth: 7,
        maxLenghth: 10,
        required: true,
        unique: true
    },
    nombreCompleto: {
        type: String,
        required: true,
        maxLenghth: 150
    },
    fechaNacimiento: {
        type: Date,
        required: true
    }
});

const cliente = mongoose.model('cliente', schemaCliente);
module.exports = cliente;

