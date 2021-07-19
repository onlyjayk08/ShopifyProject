const mongoose = require('mongoose');

var customerSchema = new mongoose.Schema({
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String },
    phone: { type: Number, unique: true },
    verified_email: { type: Boolean, default: true },
    addresses: [{
        address1: { type: String },
        city: { type: String },
        province: { type: String },
        phone: { type: Number },
        zip: { type: String },
        last_name: { type: String },
        first_name: { type: String },
        country: { type: String },
    }],
    state: { type: String, default: "Pending" },

})

module.exports = mongoose.model('customer', customerSchema);