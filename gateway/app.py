from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import time

app = Flask(__name__)
CORS(app)  # Thêm CORS

SERVICE_A_URL = "http://service-a:5001"
SERVICE_B_URL = "http://service-b:5002"

def make_request(method, url, json=None):
    max_retries = 5
    retry_delay = 5
    for attempt in range(max_retries):
        try:
            if method == "GET":
                response = requests.get(url)
            elif method == "POST":
                response = requests.post(url, json=json)
            elif method == "DELETE":
                response = requests.delete(url)
            response.raise_for_status()
            return response
        except requests.exceptions.RequestException as e:
            if attempt == max_retries - 1:
                raise e
            print(f"Retrying {method} {url} (attempt {attempt + 1}/{max_retries})...")
            time.sleep(retry_delay)

@app.route('/flights', methods=['GET'])
def get_flights():
    try:
        response = make_request("GET", f"{SERVICE_A_URL}/flights")
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

@app.route('/book', methods=['POST'])
def book_flight():
    try:
        response = make_request("POST", f"{SERVICE_A_URL}/book", json=request.get_json())
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

@app.route('/cancel_booking/<int:booking_id>', methods=['DELETE'])
def cancel_booking(booking_id):
    try:
        response = make_request("DELETE", f"{SERVICE_A_URL}/cancel_booking/{booking_id}")
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

@app.route('/bookings', methods=['GET'])
def get_bookings():
    try:
        response = make_request("GET", f"{SERVICE_A_URL}/bookings")
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

@app.route('/pay', methods=['POST'])
def process_payment():
    try:
        response = make_request("POST", f"{SERVICE_B_URL}/pay", json=request.get_json())
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)