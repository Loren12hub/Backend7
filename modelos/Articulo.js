// modelos/Articulo.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticuloSchema = new Schema({
    titulo: {
        type: String,
        required: true,
        trim: true
    },
    contenido: {
        type: String,
        required: true
    },
    imagen: {
        type: String,
        default: null
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Articulo', ArticuloSchema);