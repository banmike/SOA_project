from flask import Flask, jsonify, request, g
import psycopg2
import os
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

# Tạo bảng payments khi ứng dụng khởi động
with app.app_context():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS payments (
            payment_id SERIAL PRIMARY KEY,
            booking_id INTEGER,
            amount FLOAT,
            status VARCHAR(50)
        );
    """)
    conn.commit()
    cursor.close()

@app.route('/pay', methods=['POST'])
def process_payment():
    try:
        conn = get_db()
        cursor = conn.cursor()
        data = request.get_json()
        booking_id = data['booking_id']
        amount = data['amount']
        
        cursor.execute(
            "INSERT INTO payments (booking_id, amount, status) VALUES (%s, %s, %s) RETURNING payment_id",
            (booking_id, amount, "success")
        )
        payment_id = cursor.fetchone()[0]
        conn.commit()
        cursor.close()
        return jsonify({
            "payment_id": payment_id,
            "booking_id": booking_id,
            "amount": amount,
            "status": "success"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)