const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// Create new contact message
router.post('/', async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();
        
        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            contact: {
                id: contact._id,
                name: contact.name,
                email: contact.email
            }
        });
    } catch (error) {
        console.error('Error saving contact:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending message',
            error: error.message
        });
    }
});

// Get all contacts (for admin)
router.get('/', async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            count: contacts.length,
            contacts
        });
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching contacts',
            error: error.message
        });
    }
});

// Update contact status
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found'
            });
        }

        res.json({
            success: true,
            message: 'Status updated successfully',
            contact
        });
    } catch (error) {
        console.error('Error updating contact status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating status',
            error: error.message
        });
    }
});

module.exports = router;