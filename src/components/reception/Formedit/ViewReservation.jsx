import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewReservation = ({ 
  selectedReservation, 
  setViewMode,
  setError,
  setSuccess
}) => {
  const [roomDetails, setRoomDetails] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paymentNotes, setPaymentNotes] = useState("");

  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    duration: "",
    adults: "1",
    kids: "0",
    firstName: "",
    mobile: "",
    email: "",
    middleName: "",
    surname: "",
    dob: "",
    address: "",
    city: "",
    gender: "",
    idType: "",
    idNumber: "",
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const roomsResponse = await axios.get("http://localhost:8000/api/posts/rooms");
        const bookedRooms = roomsResponse.data.rooms.filter(room => 
          selectedReservation.selectedRooms.includes(room.RoomNo)
        );
        setRoomDetails(bookedRooms);
        
        const paymentsResponse = await axios.get(
          `http://localhost:8000/api/reservations/${selectedReservation._id}/payments`
        );
        setPaymentHistory(paymentsResponse.data);
      } catch (err) {
        console.error("Error fetching details:", err);
      }
    };
    
    fetchDetails();
    
    setFormData({
      checkIn: selectedReservation.checkIn.split('T')[0],
      checkOut: selectedReservation.checkOut.split('T')[0],
      duration: selectedReservation.duration,
      adults: selectedReservation.adults,
      kids: selectedReservation.kids,
      firstName: selectedReservation.firstName,
      mobile: selectedReservation.mobile,
      email: selectedReservation.email,
      middleName: selectedReservation.middleName || "",
      surname: selectedReservation.surname || "",
      dob: selectedReservation.dob ? selectedReservation.dob.split('T')[0] : "",
      address: selectedReservation.address,
      city: selectedReservation.city || "",
      gender: selectedReservation.gender || "",
      idType: selectedReservation.idType || "",
      idNumber: selectedReservation.idNumber || "",
    });
  }, [selectedReservation]);

  const calculateTotalDue = () => {
    if (!selectedReservation || !roomDetails.length) return 0;
    
    const roomPrices = roomDetails.reduce((total, room) => total + room.RPrice, 0);
    const duration = parseInt(selectedReservation.duration);
    const totalRoomCost = roomPrices * duration;
    
    const totalPaid = paymentHistory.reduce((total, payment) => total + payment.amount, 0);
    
    return totalRoomCost - totalPaid;
  };

  const handlePayment = async () => {
    if (!paymentAmount || paymentAmount <= 0) {
      setError("Please enter a valid payment amount");
      return;
    }
    
    try {
      const paymentData = {
        reservationId: selectedReservation._id,
        amount: paymentAmount,
        method: paymentMethod,
        notes: paymentNotes,
        date: new Date().toISOString()
      };
      
      await axios.post("http://localhost:8000/api/payments", paymentData);
      
      const paymentsResponse = await axios.get(
        `http://localhost:8000/api/reservations/${selectedReservation._id}/payments`
      );
      setPaymentHistory(paymentsResponse.data);
      
      setSuccess("Payment recorded successfully!");
      setError("");
      setPaymentAmount(0);
      setPaymentNotes("");
    } catch (err) {
      console.error("Error recording payment:", err);
      setError("Error recording payment. Please try again.");
      setSuccess("");
    }
  };

  const handleCheckout = async () => {
    if (!window.confirm("Are you sure you want to checkout this guest? This will mark all rooms as vacant.")) {
      return;
    }
    
    try {
      await axios.put(`http://localhost:8000/api/reservations/${selectedReservation._id}/checkout`);
      
      await Promise.all(
        selectedReservation.selectedRooms.map(roomNo => 
          axios.put(`http://localhost:8000/api/posts/rooms/${roomNo}`, { RStatus: "Vacant" })
        )
      );
      
      setSuccess("Guest checked out successfully! Rooms are now vacant.");
      setError("");
      setViewMode(false);
    } catch (err) {
      console.error("Error during checkout:", err);
      setError("Error during checkout. Please try again.");
      setSuccess("");
    }
  };

  return (
    <div className="view-container">
      <div className="view-header">
        <h2>Reservation Details</h2>
        <button className="back-button" onClick={() => setViewMode(false)}>
          Back to Edit
        </button>
      </div>
      
      <div className="guest-info-section">
        <h3>Guest Information</h3>
        <div className="info-grid">
          <div>
            <p><strong>Name:</strong> {formData.firstName} {formData.middleName} {formData.surname}</p>
            <p><strong>Phone:</strong> {formData.mobile}</p>
            <p><strong>Email:</strong> {formData.email || "N/A"}</p>
          </div>
          <div>
            <p><strong>Check-In:</strong> {formData.checkIn}</p>
            <p><strong>Check-Out:</strong> {formData.checkOut}</p>
            <p><strong>Duration:</strong> {formData.duration} nights</p>
          </div>
          <div>
            <p><strong>Adults:</strong> {formData.adults}</p>
            <p><strong>Kids:</strong> {formData.kids}</p>
            <p><strong>ID:</strong> {formData.idType}: {formData.idNumber}</p>
          </div>
        </div>
      </div>
      
      <div className="rooms-section">
        <h3>Booked Rooms</h3>
        <table className="rooms-table">
          <thead>
            <tr>
              <th>Room No.</th>
              <th>Type</th>
              <th>Class</th>
              <th>Price/Night</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {roomDetails.map(room => (
              <tr key={room._id}>
                <td>{room.RoomNo}</td>
                <td>{room.RType}</td>
                <td>{room.RClass}</td>
                <td>${room.RPrice.toFixed(2)}</td>
                <td>${(room.RPrice * formData.duration).toFixed(2)}</td>
              </tr>
            ))}
            <tr className="total-row">
              <td colSpan="4"><strong>Total Room Charges:</strong></td>
              <td>
                <strong>
                  ${roomDetails.reduce((total, room) => 
                    total + (room.RPrice * formData.duration), 0).toFixed(2)}
                </strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="payments-section">
        <h3>Payment History</h3>
        <table className="payments-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {paymentHistory.map((payment, index) => (
              <tr key={index}>
                <td>{new Date(payment.date).toLocaleDateString()}</td>
                <td>${payment.amount.toFixed(2)}</td>
                <td>{payment.method}</td>
                <td>{payment.notes || "N/A"}</td>
              </tr>
            ))}
            <tr className="total-row">
              <td><strong>Total Paid:</strong></td>
              <td>
                <strong>
                  ${paymentHistory.reduce((total, payment) => 
                    total + payment.amount, 0).toFixed(2)}
                </strong>
              </td>
              <td colSpan="2"></td>
            </tr>
            <tr className="due-row">
              <td><strong>Amount Due:</strong></td>
              <td>
                <strong className={calculateTotalDue() > 0 ? "amount-due" : "amount-paid"}>
                  ${calculateTotalDue().toFixed(2)}
                </strong>
              </td>
              <td colSpan="2"></td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="payment-form">
        <h3>Record Payment</h3>
        <div className="payment-inputs">
          <div>
            <label>Amount ($)</label>
            <input
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(parseFloat(e.target.value))}
              min="0.01"
              step="0.01"
            />
          </div>
          <div>
            <label>Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="Cash">Cash</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label>Notes</label>
            <input
              type="text"
              value={paymentNotes}
              onChange={(e) => setPaymentNotes(e.target.value)}
              placeholder="Optional notes"
            />
          </div>
          <button 
            type="button" 
            className="record-payment-btn"
            onClick={handlePayment}
            disabled={!paymentAmount || paymentAmount <= 0}
          >
            Record Payment
          </button>
        </div>
      </div>
      
      <div className="checkout-section">
        <button 
          className="checkout-button"
          onClick={handleCheckout}
          disabled={calculateTotalDue() > 0}
        >
          Checkout Guest
        </button>
        {calculateTotalDue() > 0 && (
          <p className="checkout-warning">
            Cannot checkout until full payment is received. Remaining balance: ${calculateTotalDue().toFixed(2)}
          </p>
        )}
      </div>
    </div>
  );
};

export default ViewReservation;