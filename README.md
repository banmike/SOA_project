Flight Booking System
Overview
This is a microservices-based flight booking system. It allows users to search for flights, book them, and process payments. A frontend is provided to interact with the APIs.
Structure

docs/: Documentation files (analysis, architecture, API specs).
gateway/: API gateway to route requests.
services/service-a/: Manages flight search and booking.
services/service-b/: Handles payment processing.
frontend/: Web frontend to test the APIs.
scripts/init.sh: Script to set up the environment.
docker-compose.yml: Docker configuration for running services.

Setup

Ensure Docker and Docker Compose are installed.
Copy .env.example to .env and configure if needed.
Run the setup script: bash scripts/init.sh.
Start the services: docker-compose up --build.

Usage

Access the frontend at http://localhost:8080.
Use the UI to:
Search for flights (GET /flights).
Book a flight (POST /book).
Process payment (POST /pay).

Alternatively, interact with the APIs directly via the gateway at http://localhost:5000.

Development

Each service is built with Python Flask.
The frontend is a static web app using HTML, JavaScript, and Tailwind CSS, served by Nginx.
Add new services by creating a new folder under services/ and updating docker-compose.yml.
