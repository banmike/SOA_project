from flask import Flask, jsonify, request, g
import psycopg2
import os
from datetime import datetime, timedelta
import random
import time

app = Flask(__name__)

# Hàm lấy kết nối database và lưu vào g
def get_db():
    if 'db' not in g:
        max_retries = 5
        retry_delay = 5  # seconds
        DATABASE_URL = os.getenv("DATABASE_URL")
        for attempt in range(max_retries):
            try:
                g.db = psycopg2.connect(DATABASE_URL)
                print("Connected to PostgreSQL successfully!")
                break
            except psycopg2.OperationalError as e:
                print(f"Failed to connect to PostgreSQL (attempt {attempt + 1}/{max_retries}): {e}")
                if attempt == max_retries - 1:
                    raise e
                time.sleep(retry_delay)
    return g.db

# Đóng kết nối sau mỗi yêu cầu
@app.teardown_appcontext
def close_connection(exception):
    db = g.pop('db', None)
    if db is not None:
        db.close()

# Tạo bảng và dữ liệu mẫu khi ứng dụng khởi động
with app.app_context():
    conn = get_db()
    cursor = conn.cursor()

    # Tạo bảng flights và bookings nếu chưa có
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS flights (
            flight_id SERIAL PRIMARY KEY,
            origin VARCHAR(50),
            destination VARCHAR(50),
            price FLOAT,
            departure_time TIMESTAMP
        );
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS bookings (
            booking_id SERIAL PRIMARY KEY,
            flight_id INTEGER UNIQUE,
            FOREIGN KEY (flight_id) REFERENCES flights(flight_id)
        );
    """)
    conn.commit()

    # Tạo 50 chuyến bay mẫu
    cities = ["NYC", "LAX", "CHI", "MIA", "SFO", "DAL", "HOU", "BOS"]
    current_time = datetime.now()
    cursor.execute("DELETE FROM flights")
    for i in range(1, 51):
        origin = random.choice(cities)
        destination = random.choice([city for city in cities if city != origin])
        price = round(random.uniform(100, 500), 2)
        hours_ahead = random.randint(0, 7 * 24)
        minutes = random.choice([0, 15, 30, 45])
        departure_time = current_time + timedelta(hours=hours_ahead, minutes=minutes)
        cursor.execute(
            "INSERT INTO flights (origin, destination, price, departure_time) VALUES (%s, %s, %s, %s)",
            (origin, destination, price, departure_time)
        )
    conn.commit()
    cursor.close()

@app.route('/flights', methods=['GET'])
def get_flights():
    try:
        conn = get_db()
        cursor = conn.cursor()
        current_time = datetime.now()
        cursor.execute(
            "SELECT * FROM flights WHERE departure_time > %s ORDER BY departure_time",
            (current_time,)
        )
        flights = [
            {
                "flight_id": row[0],
                "origin": row[1],
                "destination": row[2],
                "price": row[3],
                "departureTime": row[4].isoformat()
            }
            for row in cursor.fetchall()
        ]
        cursor.close()
        return jsonify(flights)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/book', methods=['POST'])
def book_flight():
    try:
        conn = get_db()
        cursor = conn.cursor()
        data = request.get_json()
        flight_id = data['flight_id']
        
        cursor.execute(
            "INSERT INTO bookings (flight_id) VALUES (%s) RETURNING booking_id",
            (flight_id,)
        )
        booking_id = cursor.fetchone()[0]
        conn.commit()
        cursor.close()
        return jsonify({
            "booking_id": booking_id,
            "flight_id": flight_id
        })
    except psycopg2.errors.UniqueViolation:
        conn.rollback()
        return jsonify({"error": "Chuyến bay này đã được đăng ký."}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/cancel_booking/<int:booking_id>', methods=['DELETE'])
def cancel_booking(booking_id):
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM bookings WHERE booking_id = %s RETURNING flight_id", (booking_id,))
        result = cursor.fetchone()
        if result:
            conn.commit()
            cursor.close()
            return jsonify({"message": f"Hủy đăng ký thành công cho chuyến bay {result[0]}."})
        conn.rollback()
        cursor.close()
        return jsonify({"error": "Không tìm thấy booking_id."}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/bookings', methods=['GET'])
def get_bookings():
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM bookings")
        bookings = [
            {
                "booking_id": row[0],
                "flight_id": row[1]
            }
            for row in cursor.fetchall()
        ]
        cursor.close()
        return jsonify(bookings)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)