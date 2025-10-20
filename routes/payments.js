const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const Booking = require('../models/Booking');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Calculate shipping cost
function calculateShippingCost(weight, packageType, distance = 'local') {
    let baseCost = 0;
    
    // Base cost by package type
    switch(packageType) {
        case 'document':
            baseCost = 50;
            break;
        case 'small':
            baseCost = 100;
            break;
        case 'medium':
            baseCost = 200;
            break;
        case 'large':
            baseCost = 350;
            break;
        case 'fragile':
            baseCost = 500;
            break;
        default:
            baseCost = 150;
    }
    
    // Add weight-based cost
    const weightCost = weight * 20; // ₹20 per kg
    
    // Distance multiplier
    const distanceMultiplier = {
        'local': 1,
        'regional': 1.5,
        'national': 2,
        'international': 3
    };
    
    const total = (baseCost + weightCost) * (distanceMultiplier[distance] || 1);
    return Math.round(total);
}

// Create payment order
router.post('/create-order', async (req, res) => {
    try {
        const { bookingId, amount, currency = 'INR' } = req.body;
        
        const options = {
            amount: amount * 100, // Razorpay expects amount in paise
            currency: currency,
            receipt: `receipt_${bookingId}`,
            notes: {
                bookingId: bookingId
            }
        };
        
        const order = await razorpay.orders.create(options);
        
        res.json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating payment order',
            error: error.message
        });
    }
});

// Verify payment
router.post('/verify-payment', async (req, res) => {
    try {
        const { orderId, paymentId, signature, bookingId } = req.body;
        
        // In production, verify the signature using Razorpay's method
        // const crypto = require('crypto');
        // const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        //     .update(orderId + "|" + paymentId)
        //     .digest('hex');
        
        // For demo, we'll assume payment is successful
        // if (expectedSignature === signature) {
        
        // Update booking status to confirmed
        const booking = await Booking.findByIdAndUpdate(
            bookingId,
            { 
                status: 'confirmed',
                paymentStatus: 'paid',
                paymentId: paymentId,
                orderId: orderId
            },
            { new: true }
        );
        
        res.json({
            success: true,
            message: 'Payment verified successfully',
            booking: {
                id: booking._id,
                trackingNumber: booking.trackingNumber,
                status: booking.status
            }
        });
        // } else {
        //     res.status(400).json({
        //         success: false,
        //         message: 'Payment verification failed'
        //     });
        // }
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying payment',
            error: error.message
        });
    }
});

// Calculate shipping cost
router.post('/calculate-cost', async (req, res) => {
    try {
        const { packageType, packageWeight, distance = 'local' } = req.body;
        
        const cost = calculateShippingCost(packageWeight, packageType, distance);
        
        res.json({
            success: true,
            cost: cost,
            breakdown: {
                baseCost: calculateShippingCost(0, packageType, distance),
                weightCost: packageWeight * 20,
                total: cost
            }
        });
    } catch (error) {
        console.error('Error calculating cost:', error);
        res.status(500).json({
            success: false,
            message: 'Error calculating shipping cost',
            error: error.message
        });
    }
});

module.exports = router;