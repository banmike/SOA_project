const API_BASE_URL = "http://localhost:5000"; // Gateway URL

// Search Flights
document
  .getElementById("searchFlightsBtn")
  .addEventListener("click", async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/flights`);
      const flights = await response.json();
      const resultDiv = document.getElementById("flightsResult");
      resultDiv.innerHTML =
        '<h3 class="text-lg font-semibold">Available Flights:</h3>';
      flights.forEach((flight) => {
        resultDiv.innerHTML += `<p>Flight ID: ${flight.flight_id}, Origin: ${flight.origin}, Destination: ${flight.destination}, Price: $${flight.price}</p>`;
      });
    } catch (error) {
      document.getElementById(
        "flightsResult"
      ).innerHTML = `<p class="text-red-500">Error: ${error.message}</p>`;
    }
  });

// Book Flight
document.getElementById("bookFlightBtn").addEventListener("click", async () => {
  const userId = document.getElementById("userId").value;
  const flightId = document.getElementById("flightId").value;
  try {
    const response = await fetch(`${API_BASE_URL}/book`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: parseInt(userId),
        flight_id: parseInt(flightId),
      }),
    });
    const booking = await response.json();
    document.getElementById(
      "bookingResult"
    ).innerHTML = `<p class="text-green-500">Booking Successful! Booking ID: ${booking.booking_id}</p>`;
  } catch (error) {
    document.getElementById(
      "bookingResult"
    ).innerHTML = `<p class="text-red-500">Error: ${error.message}</p>`;
  }
});

// Process Payment
document
  .getElementById("processPaymentBtn")
  .addEventListener("click", async () => {
    const bookingId = document.getElementById("bookingId").value;
    const amount = document.getElementById("amount").value;
    try {
      const response = await fetch(`${API_BASE_URL}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_id: parseInt(bookingId),
          amount: parseFloat(amount),
        }),
      });
      const payment = await response.json();
      document.getElementById(
        "paymentResult"
      ).innerHTML = `<p class="text-green-500">Payment Successful! Payment ID: ${payment.payment_id}, Status: ${payment.status}</p>`;
    } catch (error) {
      document.getElementById(
        "paymentResult"
      ).innerHTML = `<p class="text-red-500">Error: ${error.message}</p>`;
    }
  });
