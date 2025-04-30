FROM python:3.9-slim

WORKDIR /app
COPY . .
RUN pip install flask requests psycopg2-binary  # Thêm psycopg2-binary
CMD ["python", "app.py"]