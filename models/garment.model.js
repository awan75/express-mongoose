const mongoose = require('mongoose')

const garmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'nama tidak boleh kosong']
    },
    location: {
        type: String
    },
    contact: {
        type: String,
        required: [true, 'kontak tidak boleh kosong']
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
}]
})