const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware - Fixed CORS for production
app.use(cors({
    origin: [
        'http://localhost:8000', 
        'http://127.0.0.1:8000', 
        'http://localhost:3000', 
        'http://127.0.0.1:3000',
        'https://jtcs-service-9.onrender.com'  // ✅ ADD YOUR PRODUCTION URL
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ✅ ADD THIS: Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// ✅ ADD THIS: Essential root route for Render
app.get('/', (req, res) => {
    res.json({
        message: 'JTCS Service is running! 🚀',
        status: 'success',
        database: 'Connected ✅',
        timestamp: new Date().toISOString(),
        routes: [
            '/api/health',
            '/api/test',
            '/api/bookings',
            '/api/contact'
        ]
    });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jtcservices')
.then(() => console.log('✅ Connected to MongoDB successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Test route working' });
});

// Debug: Check what files exist in routes folder
const routesPath = path.join(__dirname, 'routes');

console.log('=== CHECKING ROUTES FOLDER ===');
try {
    const files = fs.readdirSync(routesPath);
    console.log('Files in routes folder:', files);
} catch (error) {
    console.error('Error reading routes folder:', error.message);
}

// Load routes
console.log('\n=== LOADING ROUTES ===');

try {
    console.log('Loading booking route...');
    const bookingRoutes = require('./routes/booking');
    console.log('Booking route type:', typeof bookingRoutes);
    app.use('/api/bookings', bookingRoutes);
    console.log('✅ Booking route loaded successfully');
} catch (error) {
    console.error('❌ Error loading booking route:', error);
}

try {
    console.log('Loading contact route...');
    const contactRoutes = require('./routes/contact');
    console.log('Contact route type:', typeof contactRoutes);
    app.use('/api/contact', contactRoutes);
    console.log('✅ Contact route loaded successfully');
} catch (error) {
    console.error('❌ Error loading contact route:', error);
}

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true,
        status: 'OK', 
        timestamp: new Date(),
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// ✅ ADD THIS: Catch-all route to serve frontend - MUST BE LAST
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📍 Local: http://localhost:${PORT}`);
    console.log(`🌐 Production: https://jtcs-service-9.onrender.com`);
    console.log(`📊 Test Route: http://localhost:${PORT}/api/test`);
    console.log(`❤️ Health Check: http://localhost:${PORT}/api/health`);

});
