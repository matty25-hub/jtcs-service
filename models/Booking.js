const mongoose = require('mongoose');

const trackingHistorySchema = new mongoose.Schema({
    status: {
        type: String,
        required: true
    },
    location: String,
    description: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const bookingSchema = new mongoose.Schema({
    trackingNumber: {
        type: String,
        unique: true,
        required: true
    },
    senderName: {
        type: String,
        required: true
    },
    senderPhone: {
        type: String,
        required: true
    },
    senderAddress: {
        type: String,
        required: true
    },
    receiverName: {
        type: String,
        required: true
    },
    receiverPhone: {
        type: String,
        required: true
    },
    receiverAddress: {
        type: String,
        required: true
    },
    packageType: {
        type: String,
        required: true,
        enum: ['document', 'parcel', 'electronics', 'fragile']
    },
    packageWeight: {
        type: Number,
        required: true,
        min: 0.1
    },
    packageDescription: String,
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'picked-up', 'in-transit', 'out-for-delivery', 'delivered', 'cancelled']
    },
    estimatedDelivery: Date,
    actualDelivery: Date,
    price: Number,
});

// Update updatedAt before saving
bookingSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Booking', bookingSchema);