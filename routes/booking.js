const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// Generate unique tracking number
function generateTrackingNumber() {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    return 'SC' + timestamp.substr(-6) + random;
}

// Create new booking
router.post('/', async (req, res) => {
    try {
        const trackingNumber = generateTrackingNumber();
        
        const booking = new Booking({
            ...req.body,
            trackingNumber,
            trackingHistory: [{
                status: 'pending',
                location: 'Processing request',
                description: 'Booking created successfully'
            }]
        });

        await booking.save();
        
        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            trackingNumber: booking.trackingNumber,
            booking: {
                id: booking._id,
                trackingNumber: booking.trackingNumber,
                senderName: booking.senderName,
                receiverName: booking.receiverName,
                status: booking.status
            }
        });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating booking',
            error: error.message
        });
    }
});

// Track package
router.get('/track/:trackingNumber', async (req, res) => {
    try {
        const booking = await Booking.findOne({ 
            trackingNumber: req.params.trackingNumber.toUpperCase() 
        });
        
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Tracking number not found'
            });
        }

        res.json({
            success: true,
            booking: {
                trackingNumber: booking.trackingNumber,
                senderName: booking.senderName,
                senderPhone: booking.senderPhone,
                senderAddress: booking.senderAddress,
                receiverName: booking.receiverName,
                receiverPhone: booking.receiverPhone,
                receiverAddress: booking.receiverAddress,
                packageType: booking.packageType,
                packageWeight: booking.packageWeight,
                packageDescription: booking.packageDescription,
                status: booking.status,
                estimatedDelivery: booking.estimatedDelivery,
                trackingHistory: booking.trackingHistory,
                createdAt: booking.createdAt
            }
        });
    } catch (error) {
        console.error('Error tracking package:', error);
        res.status(500).json({
            success: false,
            message: 'Error tracking package',
            error: error.message
        });
    }
});

// Get all bookings (for admin)
router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            count: bookings.length,
            bookings
        });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching bookings',
            error: error.message
        });
    }
});

// Update booking status
router.put('/:id/status', async (req, res) => {
    try {
        const { status, location, description } = req.body;
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        booking.status = status;
        booking.trackingHistory.push({
            status,
            location,
            description,
            timestamp: new Date()
        });

        await booking.save();
        
        res.json({
            success: true,
            message: 'Status updated successfully',
            booking: {
                id: booking._id,
                trackingNumber: booking.trackingNumber,
                status: booking.status,
                trackingHistory: booking.trackingHistory
            }
        });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating status',
            error: error.message
        });
    }
});

// Get booking by ID
router.get('/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.json({
            success: true,
            booking
        });
    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching booking',
            error: error.message
        });
    }
});

// Delete booking
router.delete('/:id', async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.json({
            success: true,
            message: 'Booking deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting booking',
            error: error.message
        });
    }
});

module.exports = router;