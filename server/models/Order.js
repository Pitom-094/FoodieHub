const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    orderItems: [
        {
            name: { type: String, required: true },
            qty: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            food: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Food'
            }
        }
    ],
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    paymentMethod: {
        type: String,
        required: true,
        default: 'COD'
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'],
        default: 'Pending'
    },
    deliveryPerson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false
    },
    isDelivered: {
        type: Boolean,
        required: true,
        default: false
    },
    paidAt: {
        type: Date
    },
    deliveredAt: {
        type: Date
    },
    paymentResult: {
        id: { type: String },
        status: { type: String },
        bank: { type: String },
        accountHolder: { type: String },
        verifiedAt: { type: Date }
    }
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
