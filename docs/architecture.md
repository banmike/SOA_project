# architecture.md

System Architecture
Overview
The flight booking system enables users to search for flights, book them, and process payments using a microservices architecture. It ensures modularity, scalability, and ease of maintenance.
System Components

Service A: Manages flight search and booking operations.
Service B: Handles payment processing for bookings.
API Gateway: Routes incoming requests to the appropriate service.

Communication

Services communicate via REST APIs over HTTP.
Internal networking is managed using Docker Compose service names (e.g., gateway, service-a, service-b).

Data Flow

User sends a request to the gateway (e.g., search flights).
Gateway routes the request to service-a for flight search/booking or service-b for payment.
Service-a and service-b communicate internally (e.g., service-a calls service-b to confirm payment after booking).

Diagram
A high-level architecture diagram is available in docs/asset/ (not included in this text-based setup).
Scalability & Fault Tolerance

Each service can be scaled independently by adding more instances in Docker.
In-memory storage is used for simplicity; a database can be added for persistence and fault tolerance.
