const mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    title: {type: String, require: true},
    body_html: {type: String},     
    vendor: {type: String},
    product_type: {type:String},
    tags: [{type: String}],
    image: {
        src: {type: String}
    },
    state: {type: String, default: "Pending"},
    variant: {
        option1: {type: String},
        price: {type: String},
    },
    custom_collection:{
        title:{type: String},
    },
})

module.exports = mongoose.model('product', productSchema);
