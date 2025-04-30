import { useState } from 'react';
import FlightTable from './components/FlightTable';
import PaymentForm from './components/PaymentForm';
import Message from './components/Message';

const App = () => {
  const [flights, setFlights] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  // Lấy danh sách chuyến bay
  const fetchFlights = async () => {
    try {
      const response = await fetch('http://localhost:5000/flights');
      if (!response.ok) throw new Error('Không thể lấy danh sách chuyến bay.');
      const data = await response.json();
      setFlights(data);
      setMessage(data.length > 0 ? '' : 'Không có chuyến bay khả thi.');
    } catch (error) {
      setMessage('Lỗi khi lấy danh sách chuyến bay: ' + error.message);
    }
  };

  // Lấy danh sách bookings
  const fetchBookings = async () => {
    try {
      const response = await fetch('http://localhost:5000/bookings');
      if (!response.ok) throw new Error('Không thể lấy danh sách đặt vé.');
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      setMessage('Lỗi khi lấy danh sách đặt vé: ' + error.message);
    }
  };

  // Gọi cả flights và bookings
  const handleSearchFlights = async () => {
    setShowPaymentForm(false); // Ẩn form thanh toán khi tìm kiếm
    await fetchFlights();
    await fetchBookings();
  };

  // Đặt vé
  const bookFlight = async (flightId) => {
    try {
      const response = await fetch('http://localhost:5000/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flight_id: flightId }),
      });
      if (!response.ok) throw new Error((await response.json()).error || 'Không thể đặt vé.');
      const data = await response.json();
      setMessage(`Đăng ký thành công! Booking ID: ${data.booking_id}`);
      await fetchBookings();
    } catch (error) {
      setMessage('Lỗi khi đặt vé: ' + error.message);
    }
  };

  // Hủy đăng ký
  const cancelBooking = async (bookingId) => {
    try {
      const response = await fetch(`http://localhost:5000/cancel_booking/${bookingId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error((await response.json()).error || 'Không thể hủy đăng ký.');
      const data = await response.json();
      setMessage(data.message);
      await fetchBookings();
    } catch (error) {
      setMessage('Lỗi khi hủy đăng ký: ' + error.message);
    }
  };

  // Thanh toán
  const processPayment = async (bookingId, amount) => {
    try {
      const response = await fetch('http://localhost:5000/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id: parseInt(bookingId), amount: parseFloat(amount) }),
      });
      if (!response.ok) throw new Error((await response.json()).error || 'Không thể thanh toán.');
      const data = await response.json();
      setMessage(`Thanh toán thành công! Payment ID: ${data.payment_id}, Status: ${data.status}`);
      setShowPaymentForm(false);
      await fetchBookings();
    } catch (error) {
      setMessage('Lỗi khi thanh toán: ' + error.message);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">Hệ Thống Đặt Vé Máy Bay</h1>

      {/* Nút Search Flights */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-lg flex justify-center">
        <button
          onClick={handleSearchFlights}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Tìm Chuyến Bay
        </button>
      </div>

      {/* Thông báo */}
      {message && <Message message={message} />}

      {/* Bảng hiển thị chuyến bay */}
      {flights.length > 0 && (
        <FlightTable
          flights={flights}
          bookings={bookings}
          bookFlight={bookFlight}
          cancelBooking={cancelBooking}
          setShowPaymentForm={setShowPaymentForm}
        />
      )}

      {/* Form thanh toán */}
      {showPaymentForm && (
        <PaymentForm
          bookings={bookings}
          processPayment={processPayment}
          onCancel={() => setShowPaymentForm(false)}
        />
      )}
    </div>
  );
};

export default App;