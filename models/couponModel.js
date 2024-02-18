const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var CouponSchema = new mongoose.Schema({
    name_coupon: {
        type: String,
        required: true,
        unique: true,
    },
    disscount: {
        type: Number,
        required: true,
    },
    expiry: {
        type: Date,
        required: true,
    }
}, {
    timestamps: true,
});

//Export the model
module.exports = mongoose.model('Coupon', CouponSchema);