const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var OrderSchema = new mongoose.Schema({
    products: [{
        product: { type: mongoose.Types.ObjectId, ref: 'Product' },
        quantity: Number,
        color: String,
        price: Number,
        thumb: String,
        title: String
    }],
    status: {
        type: String,
        default: 'Processing',
        enum: ['Cancelled', 'Processing', 'Successed']
    },
    total: Number,
    // coupon: {
    //     type: mongoose.Types.ObjectId,
    //     ref: 'Coupon'
    // },
    orderBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Order', OrderSchema);