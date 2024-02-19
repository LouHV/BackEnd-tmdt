const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var OrderSchema = new mongoose.Schema({
    products: [{
        product: { type: mongoose.Types.ObjectId, ref: 'Product' },
        count: Number,
        color: String
    }],
    status: {
        type: String,
        default: 'Processing',
        enum: ['Cancelled', 'Processing', 'Successed']
    },
    paymentIntent:{},
    oderBy:{
        type: mongoose.Types.ObjectId,
        ref:'User'
    }
}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Order', OrderSchema);