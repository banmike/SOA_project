import { useState } from 'react';

const PaymentForm = ({ bookings, processPayment, onCancel }) => {
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedBookingId || !amount) {
      alert('Vui lòng điền đầy đủ thông tin.');
      return;
    }
    processPayment(selectedBookingId, amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Thanh Toán</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Chọn Booking ID:</label>
          <select
            value={selectedBookingId}
            onChange={(e) => setSelectedBookingId(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Chọn Booking ID</option>
            {bookings.map((booking) => (
              <option key={booking.booking_id} value={booking.booking_id}>
                Booking ID: {booking.booking_id} (Flight ID: {booking.flight_id})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Số Tiền ($):</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập số tiền"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
          >
            Thanh Toán
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;