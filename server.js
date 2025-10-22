const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ FIXED CORS - Allow Netlify frontend
app.use(cors({
    origin: [
        'https://subtle-vacherin-e66921.netlify.app', // Your Netlify frontend
        'http://localhost:8000', 
        'http://127.0.0.1:8000',
        'http://localhost:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ✅ REMOVED: Frontend static file serving
// ❌ DELETE THESE LINES if they exist:
// app.use(express.static(path.join(__dirname, '../frontend')));
// app.get('*', (req, res) => { res.sendFile(...) });

// ✅ ESSENTIAL: Root route
app.get('/', (req, res) => {
    res.json({
        message: 'JTCS API Service is running! 🚀',
        status: 'success',
        database: 'Connected ✅',
        timestamp: new Date().toISOString(),
        frontend: 'https://subtle-vacherin-e66921.netlify.app',
        routes: [
            'GET  /api/health',
            'GET  /api/test',
            'POST /api/bookings',
            'POST /api/contact'
        ]
    });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jtcservices')
.then(() => console.log('✅ Connected to MongoDB successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Test route working', success: true });
});

// Debug: Check routes folder
console.log('=== CHECKING ROUTES FOLDER ===');
try {
    const files = fs.readdirSync('./routes');
    console.log('Files in routes folder:', files);
} catch (error) {
    console.error('Error reading routes folder:', error.message);
}

// Load routes
console.log('\n=== LOADING ROUTES ===');

// Booking routes
try {
    const bookingRoutes = require('./routes/booking');
    app.use('/api/bookings', bookingRoutes);
    console.log('✅ Booking route loaded');
} catch (error) {
    console.error('❌ Error loading booking route:', error);
}

// Contact routes  
try {
    const contactRoutes = require('./routes/contact');
    app.use('/api/contact', contactRoutes);
    console.log('✅ Contact route loaded');
} catch (error) {
    console.error('❌ Error loading contact route:', error);
}

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true,
        status: 'OK', 
        timestamp: new Date(),
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// ✅ REMOVED: Catch-all route for frontend

app.listen(PORT, () => {
    console.log(`🚀 API Server running on port ${PORT}`);
    console.log(`🌐 Production: https://jtcs-service-11.onrender.com`);
    console.log(`🎯 Frontend: https://subtle-vacherin-e66921.netlify.app`);
});
