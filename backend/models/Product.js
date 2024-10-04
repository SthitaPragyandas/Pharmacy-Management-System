const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    manufacturers: { type: String, required: true },
    warning: { type: String, required: true },
    purpose: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
