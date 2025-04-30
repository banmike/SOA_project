const FlightTable = ({ flights, bookings, bookFlight, cancelBooking, setShowPaymentForm }) => {
  const isFlightBooked = (flightId) => {
    return bookings.some(booking => booking.flight_id === flightId);
  };

  const getBookingId = (flightId) => {
    const booking = bookings.find(b => b.flight_id === flightId);
    return booking ? booking.booking_id : null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-10 border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-blue-700">Danh Sách Chuyến Bay</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900">
              <th className="px-5 py-3 text-left font-semibold border-b border-gray-300">Mã Chuyến</th>
              <th className="px-5 py-3 text-left font-semibold border-b border-gray-300">Nơi Đi</th>
              <th className="px-5 py-3 text-left font-semibold border-b border-gray-300">Nơi Đến</th>
              <th className="px-5 py-3 text-left font-semibold border-b border-gray-300">Giá Vé</th>
              <th className="px-5 py-3 text-left font-semibold border-b border-gray-300">Thời Gian</th>
              <th className="px-5 py-3 text-left font-semibold border-b border-gray-300">Hành Động</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {flights.map((flight, index) => {
              const booked = isFlightBooked(flight.flight_id);
              const bookingId = getBookingId(flight.flight_id);
              const bgRow = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';

              return (
                <tr key={flight.flight_id} className={`${bgRow} hover:bg-blue-50 transition`}>
                  <td className="px-5 py-3 border-b">{flight.flight_id}</td>
                  <td className="px-5 py-3 border-b">{flight.origin}</td>
                  <td className="px-5 py-3 border-b">{flight.destination}</td>
                  <td className="px-5 py-3 border-b text-green-600 font-medium">${flight.price}</td>
                  <td className="px-5 py-3 border-b">
                    {new Date(flight.departureTime).toLocaleString("vi-VN", {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-5 py-3 border-b flex flex-wrap gap-2">
                    {booked ? (
                      <>
                        <button
                          onClick={() => cancelBooking(bookingId)}
                          className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                        >
                          Hủy
                        </button>
                        <button
                          onClick={() => setShowPaymentForm(bookingId)}
                          className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
                        >
                          Thanh Toán
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => bookFlight(flight.flight_id)}
                        className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
                      >
                        Đặt Vé
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FlightTable;
