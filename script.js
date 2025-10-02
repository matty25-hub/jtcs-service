// Handle Contact Form
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById('contactForm');
  const contactResponse = document.getElementById('contactResponse');
  const trackForm = document.getElementById('trackForm');
  const trackingResult = document.getElementById('trackingResult');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());

      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      contactResponse.textContent = result.message || 'Message sent!';
      contactForm.reset();
    });
  }

  // Handle Tracking Form
  if (trackForm) {
    trackForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const trackingId = document.getElementById('trackingId').value;
      const res = await fetch(`http://localhost:5000/api/track/${trackingId}`);
      const result = await res.json();

      if (result.message) {
        trackingResult.innerHTML = `<p>${result.message}</p>`;
      } else {
        trackingResult.innerHTML = `
          <p><strong>Status:</strong> ${result.status}</p>
          <p><strong>Origin:</strong> ${result.origin}</p>
          <p><strong>Destination:</strong> ${result.destination}</p>
          <p><strong>Last Updated:</strong> ${new Date(result.updatedAt).toLocaleString()}</p>
        `;
      }
    });
  }
});
