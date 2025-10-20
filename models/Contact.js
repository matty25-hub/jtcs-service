const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: String,
    subject: String,
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'new',
        enum: ['new', 'read', 'replied', 'closed']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Contact', contactSchema);