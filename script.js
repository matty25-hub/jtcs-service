const API_URL = 'http://localhost:5000/api/shipments';

async function addUser() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;

  if (name && email) {
    try {
      // Send data to your backend API
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderName: name,
          recipientEmail: email
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Add to the list on frontend
        const li = document.createElement("li");
        li.textContent = `Sender: ${name} | Recipient: ${email}`;
        document.getElementById("usersList").appendChild(li);

        // Clear form
        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        
        alert("Shipment booked successfully!");
      } else {
        alert("Failed to book shipment. Please try again.");
      }
    } catch (error) {
      console.error('Error:', error);
      alert("Error connecting to server. Make sure your backend is running on port 5000.");
    }
  } else {
    alert("Please enter both sender and recipient details.");
  }
}

// Load existing shipments when page loads
async function loadShipments() {
  try {
    const response = await fetch(API_URL);
    
    if (response.ok) {
      const shipments = await response.json();
      
      const usersList = document.getElementById("usersList");
      usersList.innerHTML = ''; // Clear existing list
      
      shipments.forEach(shipment => {
        const li = document.createElement("li");
        li.textContent = `Sender: ${shipment.senderName} | Recipient: ${shipment.recipientEmail}`;
        usersList.appendChild(li);
      });
    }
  } catch (error) {
    console.error('Error loading shipments:', error);
  }
}

// Call loadShipments when page loads
window.onload = loadShipments;