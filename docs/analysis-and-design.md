# analysis-and-design.md

📊 Microservices System - Analysis and Design
This document outlines the analysis and design process for a microservices-based flight booking system.

1. 🎯 Problem Statement
   The system enables users to search for flights, book them, and process payments securely.

Users: Travelers looking to book flights.
Goals: Provide a seamless flight booking experience with search, booking, and payment functionalities.
Data Processed: Flight details, booking records, payment transactions.

2. 🧩 Identified Microservices

Service Name
Responsibility
Tech Stack

service-a
Manages flight search and booking
Python Flask

service-b
Handles payment processing
Python Flask

gateway
Routes requests to services
Python Flask

3. 🔄 Service Communication

Gateway ⇄ service-a (REST)
Gateway ⇄ service-b (REST)
Internal: service-a ⇄ service-b (REST for payment confirmation)

4. 🗂️ Data Design

service-a: Stores flight details (flight ID, origin, destination, price) and bookings (booking ID, user ID, flight ID).
service-b: Stores payment records (payment ID, booking ID, amount, status).

Schema Example:

service-a (Flights): { "flight_id": int, "origin": str, "destination": str, "price": float }
service-a (Bookings): { "booking_id": int, "user_id": int, "flight_id": int }
service-b (Payments): { "payment_id": int, "booking_id": int, "amount": float, "status": str }

5. 🔐 Security Considerations

Validate all inputs to prevent injection attacks.
Use API keys for internal service communication.
Encrypt sensitive payment data (not implemented in this basic version).

6. 📦 Deployment Plan

Use docker-compose to manage the local environment.
Each service has its own Dockerfile.
Environment config stored in .env file.

7. 🎨 Architecture Diagram
   +---------+ +--------------+| Gateway | <----> | Service A || | <----> | Flight Mgmt |+---------+ +--------------+ | ^ v |+--------------+ +------------------+| Service B | | In-Memory Store || Payment Mgmt | +------------------++--------------+

✅ Summary
This architecture supports independent development of flight booking and payment services, scales by adding more instances of each service, and ensures modularity through REST-based communication.
