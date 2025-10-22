// API Base URL - FIXED FOR PRODUCTION
const API_BASE_URL = '/api';  // ← CHANGED THIS LINE

console.log('✅ script.js loaded successfully');
console.log('API Base URL:', API_BASE_URL);

// Modal Functions
function openBookingForm() {
    console.log('Opening booking form');
    document.getElementById('bookingModal').style.display = 'block';
}

function closeBookingForm() {
    console.log('Closing booking form');
    document.getElementById('bookingModal').style.display = 'none';
}

function openContactForm() {
    console.log('Opening contact form modal');
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeContactForm() {
    console.log('Closing contact form modal');
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function scrollToTracking() {
    console.log('Scrolling to tracking section');
    const trackingSection = document.getElementById('tracking');
    if (trackingSection) {
        trackingSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Close modals when clicking outside
window.onclick = function(event) {
    const bookingModal = document.getElementById('bookingModal');
    const contactModal = document.getElementById('contactModal');
    
    if (event.target === bookingModal) {
        closeBookingForm();
    }
    if (event.target === contactModal) {
        closeContactForm();
    }
}

// Booking Form Submission
async function bookPackage(event) {
    console.log('🎯 Book package function called');
    
    // Prevent default form submission
    event.preventDefault();
    console.log('✅ Form submission prevented');
    
    // Get form data
    const form = event.target;
    const formData = new FormData(form);
    
    const bookingData = {
        senderName: formData.get('senderName'),
        senderPhone: formData.get('senderPhone'),
        senderAddress: formData.get('senderAddress'),
        receiverName: formData.get('receiverName'),
        receiverPhone: formData.get('receiverPhone'),
        receiverAddress: formData.get('receiverAddress'),
        packageType: formData.get('packageType'),
        packageWeight: parseFloat(formData.get('packageWeight')) || 0,
        packageDescription: formData.get('packageDescription')
    };

    console.log('📦 Form data collected:', bookingData);

    // Validate required fields
    const requiredFields = ['senderName', 'senderPhone', 'senderAddress', 'receiverName', 'receiverPhone', 'receiverAddress', 'packageType'];
    const missingFields = requiredFields.filter(field => !bookingData[field] || bookingData[field].trim() === '');
    
    if (missingFields.length > 0) {
        console.error('❌ Missing fields:', missingFields);
        alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
    }

    if (!bookingData.packageWeight || bookingData.packageWeight <= 0) {
        console.error('❌ Invalid package weight');
        alert('Please enter a valid package weight (minimum 0.1 kg)');
        return;
    }

    try {
        console.log('🚀 Starting booking process...');
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Booking...';
        submitBtn.disabled = true;

        // Send booking request
        console.log('📤 Sending request to:', `${API_BASE_URL}/bookings`);
        
        const response = await fetch(`${API_BASE_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData)
        });

        console.log('📨 Response status:', response.status);
        console.log('📨 Response ok:', response.ok);
        
        const data = await response.json();
        console.log('✅ Server response:', data);

        if (data.success) {
            console.log('🎉 Booking successful! Tracking number:', data.trackingNumber);
            
            // Show success message
            alert(`✅ Booking created successfully!\n\nYour tracking number: ${data.trackingNumber}\n\nSave this number to track your package.`);
            
            // Reset form and close modal
            form.reset();
            closeBookingForm();
            
        } else {
            console.error('❌ Server returned error:', data.message);
            alert(`❌ Error: ${data.message}`);
        }
        
    } catch (error) {
        console.error('💥 Booking error:', error);
        alert('❌ Failed to create booking. Please check your connection and try again.');
    } finally {
        // Reset button state
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Book Pickup';
            submitBtn.disabled = false;
        }
    }
}

// Contact Form Submission (Modal)
async function submitContact(event) {
    event.preventDefault();
    console.log('📞 Contact form submitted (Modal)');
    
    const form = event.target;
    const formData = new FormData(form);
    
    const contactData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone') || '',
        message: formData.get('message')
    };

    console.log('📧 Contact data:', contactData);

    // Validate required fields
    if (!contactData.name || !contactData.email || !contactData.message) {
        alert('Please fill in all required fields: Name, Email, and Message');
        return;
    }

    try {
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        console.log('📤 Sending contact request to:', `${API_BASE_URL}/contact`);
        
        const response = await fetch(`${API_BASE_URL}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contactData)
        });

        console.log('📨 Contact response status:', response.status);
        
        const data = await response.json();
        console.log('✅ Contact response data:', data);

        if (data.success) {
            alert('✅ Message sent successfully! We will get back to you soon.');
            form.reset();
            closeContactForm();
        } else {
            alert(`❌ Error: ${data.message}`);
        }
        
    } catch (error) {
        console.error('💥 Contact error:', error);
        alert('❌ Failed to send message. Please check your connection and try again.');
    } finally {
        // Reset button state
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            submitBtn.disabled = false;
        }
    }
}

// Contact Page Form Submission
async function submitContactPage(event) {
    event.preventDefault();
    console.log('📞 Contact page form submitted');
    
    const form = event.target;
    const formData = new FormData(form);
    
    const contactData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone') || '',
        message: formData.get('message')
    };

    console.log('📧 Contact page data:', contactData);

    // Validate required fields
    if (!contactData.name || !contactData.email || !contactData.message) {
        alert('Please fill in all required fields: Name, Email, and Message');
        return;
    }

    try {
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        console.log('📤 Sending contact page request to:', `${API_BASE_URL}/contact`);
        
        const response = await fetch(`${API_BASE_URL}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contactData)
        });

        console.log('📨 Contact page response status:', response.status);
        
        const data = await response.json();
        console.log('✅ Contact page response data:', data);

        if (data.success) {
            alert('✅ Message sent successfully! We will get back to you soon.');
            form.reset();
        } else {
            alert(`❌ Error: ${data.message}`);
        }
        
    } catch (error) {
        console.error('💥 Contact page error:', error);
        alert('❌ Failed to send message. Please check your connection and try again.');
    } finally {
        // Reset button state
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            submitBtn.disabled = false;
        }
    }
}

// Tracking Function
async function trackPackage() {
    console.log('🔍 Track package function called');
    
    const trackingNumber = document.getElementById('trackingNumber').value.trim().toUpperCase();
    const trackingResult = document.getElementById('trackingResult');
    
    console.log('Tracking number:', trackingNumber);
    
    if (!trackingNumber) {
        trackingResult.innerHTML = '<div class="error">❌ Please enter a tracking number</div>';
        return;
    }

    try {
        trackingResult.innerHTML = '<div class="loading">🔍 Searching for package...</div>';
        
        const response = await fetch(`${API_BASE_URL}/bookings/track/${trackingNumber}`);
        console.log('Tracking response status:', response.status);
        
        const data = await response.json();
        console.log('Tracking data:', data);
        
        if (data.success && data.booking) {
            // Display tracking results
            trackingResult.innerHTML = `
                <div class="tracking-info success">
                    <h3>📦 Package Found!</h3>
                    <p><strong>Tracking Number:</strong> ${data.booking.trackingNumber}</p>
                    <p><strong>Status:</strong> ${data.booking.status}</p>
                    <p><strong>Sender:</strong> ${data.booking.senderName}</p>
                    <p><strong>Receiver:</strong> ${data.booking.receiverName}</p>
                </div>
            `;
        } else {
            trackingResult.innerHTML = `<div class="error">❌ ${data.message || 'Package not found'}</div>`;
        }
    } catch (error) {
        console.error('Tracking error:', error);
        trackingResult.innerHTML = `<div class="error">❌ Failed to track package: ${error.message}</div>`;
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM fully loaded');
    
    // Add event listeners to forms
    const bookingForm = document.getElementById('bookingForm');
    const contactForm = document.getElementById('contactForm'); // Modal form
    const contactPageForm = document.getElementById('contactPageForm'); // Page form
    
    if (bookingForm) {
        console.log('✅ Booking form found, adding event listener');
        bookingForm.addEventListener('submit', bookPackage);
    } else {
        console.error('❌ Booking form not found!');
    }
    
    if (contactForm) {
        console.log('✅ Contact modal form found, adding event listener');
        contactForm.addEventListener('submit', submitContact);
    } else {
        console.error('❌ Contact modal form not found!');
    }
    
    if (contactPageForm) {
        console.log('✅ Contact page form found, adding event listener');
        contactPageForm.addEventListener('submit', submitContactPage);
    } else {
        console.log('ℹ️ Contact page form not found (this is okay if using modal only)');
    }
    
    // Test if modals exist
    console.log('Booking modal exists:', !!document.getElementById('bookingModal'));
    console.log('Contact modal exists:', !!document.getElementById('contactModal'));
});