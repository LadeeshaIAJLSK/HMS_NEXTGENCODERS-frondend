import React from "react";

const ReservationView = ({
  reservation,
  formData,
  roomDetails,
  paymentHistory,
  totalDue,
  onEdit,
  onCheckout
}) => {
  return (
    <div className="reservation-view">
      <h2>Reservation Details</h2>
      
      <div className="guest-info">
        <h3>{formData.firstName} {formData.surname}</h3>
        <p>Mobile: {formData.mobile}</p>
        <p>Email: {formData.email}</p>
        <p>Check-In: {new Date(formData.checkIn).toLocaleDateString()}</p>
        <p>Check-Out: {new Date(formData.checkOut).toLocaleDateString()}</p>
      </div>
      
      <div className="room-info">
        <h3>Booked Rooms</h3>
        {roomDetails.map(room => (
          <div key={room.RoomNo} className="room-item">
            <p>Room {room.RoomNo} - {room.RType} ({room.RClass})</p>
            <p>Price: ${room.RPrice} per night</p>
          </div>
        ))}
      </div>
      
      <div className="payment-info">
        <h3>Payment History</h3>
        {paymentHistory.map(payment => (
          <div key={payment._id} className="payment-item">
            <p>Amount: ${payment.amount}</p>
            <p>Method: {payment.method}</p>
            <p>Date: {new Date(payment.date).toLocaleString()}</p>
          </div>
        ))}
        <div className="total-due">
          <h4>Total Due: ${totalDue}</h4>
        </div>
      </div>
      
      <div className="action-buttons">
        <button onClick={onEdit}>Edit Reservation</button>
        <button onClick={onCheckout}>Checkout Guest</button>
      </div>
    </div>
  );
};

export default ReservationView;