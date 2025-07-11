import React, { useState, useEffect } from "react";
import { Calculator, Receipt, CreditCard, DollarSign, AlertCircle, CheckCircle, Clock, User, MapPin, Calendar, Users, Bed, FileText, Download, LogOut } from "lucide-react";
import "./ViewReservationDetails.css"; // Assuming you have a CSS file for styling

const ViewReservationDetails = ({ 
  selectedReservation, 
  onBackToEdit,
  onSuccess,
  onError,
  onCheckoutComplete
}) => {
  const [roomDetails, setRoomDetails] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [cashReceived, setCashReceived] = useState(""); // New: Cash actually received
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [wantBill, setWantBill] = useState(true);
  const [showCashCalculator, setShowCashCalculator] = useState(false);

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
      if (!selectedReservation) return;
      
      setLoading(true);
      try {
        console.log("Fetching details for reservation:", selectedReservation._id);
        
        // Simulate fetching rooms data (replace with your actual API call)
        const roomsData = [
          { RoomNo: "101", RType: "Standard", RClass: "Economy", RPrice: 50 },
          { RoomNo: "102", RType: "Deluxe", RClass: "Business", RPrice: 75 },
          { RoomNo: "201", RType: "Suite", RClass: "Premium", RPrice: 120 },
        ];
        
        // Filter booked rooms
        const bookedRooms = roomsData.filter(room => 
          selectedReservation.selectedRooms?.includes(room.RoomNo)
        );
        
        setRoomDetails(bookedRooms);
        
        // Simulate payment history
        const payments = [];
        if (selectedReservation.paidAmount > 0) {
          payments.push({
            date: selectedReservation.createdAt || new Date(),
            amount: selectedReservation.paidAmount,
            method: selectedReservation.paymentMethod || "Cash",
            notes: selectedReservation.paymentNotes || "Initial payment",
            cashReceived: selectedReservation.cashReceived || selectedReservation.paidAmount,
            change: selectedReservation.change || 0
          });
        }
        
        setPaymentHistory(payments);
        
      } catch (err) {
        console.error("Error fetching details:", err);
        onError("Error loading reservation details");
        setRoomDetails([]);
        setPaymentHistory([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDetails();
    
    // Set form data
    if (selectedReservation) {
      setFormData({
        checkIn: selectedReservation.checkIn ? selectedReservation.checkIn.split('T')[0] : "2024-01-15",
        checkOut: selectedReservation.checkOut ? selectedReservation.checkOut.split('T')[0] : "2024-01-18",
        duration: selectedReservation.duration || "3",
        adults: selectedReservation.adults || "2",
        kids: selectedReservation.kids || "1",
        firstName: selectedReservation.firstName || "John",
        mobile: selectedReservation.mobile || "+1234567890",
        email: selectedReservation.email || "john@example.com",
        middleName: selectedReservation.middleName || "David",
        surname: selectedReservation.surname || "Smith",
        dob: selectedReservation.dob ? selectedReservation.dob.split('T')[0] : "1990-05-15",
        address: selectedReservation.address || "123 Main St",
        city: selectedReservation.city || "New York",
        gender: selectedReservation.gender || "Male",
        idType: selectedReservation.idType || "Passport",
        idNumber: selectedReservation.idNumber || "A1234567",
      });
    }
  }, [selectedReservation]);

  // Mock data for demonstration
  const mockSelectedReservation = {
    _id: "RES123456",
    selectedRooms: ["101", "102"],
    totalAmount: 375, // 3 nights * (50 + 75) = 375
    paidAmount: 100,
    ...selectedReservation
  };

  const calculateTotalDue = () => {
    const totalAmount = mockSelectedReservation.totalAmount || 0;
    const paidAmount = mockSelectedReservation.paidAmount || 0;
    return totalAmount - paidAmount;
  };

  const calculateTotalRoomCharges = () => {
    if (!roomDetails.length || !formData.duration) return 0;
    
    return roomDetails.reduce((total, room) => {
      const roomPrice = room.RPrice || room.Price || 0;
      return total + (roomPrice * parseInt(formData.duration));
    }, 0);
  };

  const calculateChange = () => {
    const received = parseFloat(cashReceived) || 0;
    const amount = parseFloat(paymentAmount) || 0;
    return received - amount;
  };

  const handlePayment = async () => {
    const amount = parseFloat(paymentAmount);
    const received = parseFloat(cashReceived) || amount;
    
    if (!amount || amount <= 0) {
      onError("Please enter a valid payment amount");
      return;
    }
    
    if (paymentMethod === "Cash" && received < amount) {
      onError("Cash received cannot be less than the payment amount");
      return;
    }
    
    const totalDue = calculateTotalDue();
    if (amount > totalDue) {
      onError("Payment amount cannot exceed the amount due");
      return;
    }
    
    try {
      const change = paymentMethod === "Cash" ? received - amount : 0;
      
      // Simulate API call
      console.log("Recording payment:", { 
        amount, 
        paymentMethod, 
        paymentNotes,
        cashReceived: received,
        change 
      });
      
      // Update local state
      const newPayment = {
        date: new Date(),
        amount: amount,
        method: paymentMethod,
        notes: paymentNotes || "Payment recorded",
        cashReceived: received,
        change: change
      };
      
      setPaymentHistory(prev => [...prev, newPayment]);
      
      // Update total paid amount
      mockSelectedReservation.paidAmount = (mockSelectedReservation.paidAmount || 0) + amount;
      
      if (change > 0) {
        onSuccess(`Payment recorded! Please give ${change.toFixed(2)} change to the guest.`);
      } else {
        onSuccess("Payment recorded successfully!");
      }
      
      setPaymentAmount("");
      setCashReceived("");
      setPaymentNotes("");
      setShowCashCalculator(false);
      
    } catch (err) {
      console.error("Error recording payment:", err);
      onError("Error recording payment. Please try again.");
    }
  };

  const handleCheckout = async () => {
    if (getBalanceDue() > 0) {
      onError("Cannot checkout with outstanding balance. Please complete payment first.");
      return;
    }
    
    setShowCheckoutDialog(true);
  };

  const confirmCheckout = async () => {
    try {
      // Simulate API call
      console.log("Checking out guest...");
      
      if (wantBill) {
        generateBill();
      }
      
      onSuccess("Guest checked out successfully! Rooms are now vacant.");
      if (onCheckoutComplete) onCheckoutComplete();
      onBackToEdit();
      
    } catch (err) {
      console.error("Error during checkout:", err);
      onError("Error during checkout. Please try again.");
    }
  };

  const getTotalPaid = () => {
    return paymentHistory.reduce((total, payment) => total + payment.amount, 0);
  };

  const getTotalAmount = () => {
    return mockSelectedReservation?.totalAmount || 0;
  };

  const getBalanceDue = () => {
    return getTotalAmount() - getTotalPaid();
  };

  const getPaymentStatus = () => {
    const balance = getBalanceDue();
    if (balance < 0) return "Overpaid";
    if (balance === 0) return "Fully Paid";
    if (getTotalPaid() > 0) return "Partially Paid";
    return "Not Paid";
  };

  const getPaymentStatusColor = () => {
    const balance = getBalanceDue();
    if (balance < 0) return "text-blue-600 bg-blue-100";
    if (balance === 0) return "text-green-600 bg-green-100";
    if (getTotalPaid() > 0) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  // Add the missing function
  const getPaymentStatusClass = () => {
    const balance = getBalanceDue();
    if (balance < 0) return "overpaid";
    if (balance === 0) return "fully-paid";
    if (getTotalPaid() > 0) return "partially-paid";
    return "not-paid";
  };

  const generateBill = () => {
    const bill = {
      reservationId: mockSelectedReservation._id,
      guestName: `${formData.firstName} ${formData.middleName} ${formData.surname}`.trim(),
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      duration: formData.duration,
      rooms: roomDetails.map(room => ({
        roomNo: room.RoomNo,
        type: room.RType,
        class: room.RClass,
        pricePerNight: room.RPrice || room.Price || 0,
        total: (room.RPrice || room.Price || 0) * parseInt(formData.duration)
      })),
      totalAmount: getTotalAmount(),
      totalPaid: getTotalPaid(),
      balance: getBalanceDue(),
      paymentHistory: paymentHistory,
      generatedAt: new Date().toLocaleString()
    };

    // Enhanced bill content with cash handling details
    const billContent = `
═══════════════════════════════════════════════════════════
                    GRAND HOTEL RECEIPT
═══════════════════════════════════════════════════════════

GUEST INFORMATION
─────────────────────────────────────────────────────────
Name: ${bill.guestName}
Phone: ${formData.mobile}
Email: ${formData.email || 'N/A'}
Check-in: ${bill.checkIn}
Check-out: ${bill.checkOut}
Duration: ${bill.duration} nights
Guests: ${formData.adults} Adults, ${formData.kids} Kids

ROOM DETAILS
─────────────────────────────────────────────────────────
${bill.rooms.map(room => 
  `Room ${room.roomNo} (${room.type} - ${room.class})\n` +
  `  Rate: $${room.pricePerNight.toFixed(2)} × ${formData.duration} nights = $${room.total.toFixed(2)}`
).join('\n')}

PAYMENT SUMMARY
─────────────────────────────────────────────────────────
Total Bill Amount: $${bill.totalAmount.toFixed(2)}
Total Paid: $${bill.totalPaid.toFixed(2)}
${bill.balance > 0 ? `Balance Due: $${bill.balance.toFixed(2)}` : 
  bill.balance < 0 ? `Credit Balance: $${Math.abs(bill.balance).toFixed(2)}` : 
  'Status: ✓ PAID IN FULL'}

PAYMENT DETAILS
─────────────────────────────────────────────────────────
${bill.paymentHistory.map(payment => {
  let line = `${new Date(payment.date).toLocaleDateString()} - $${payment.amount.toFixed(2)} (${payment.method})`;
  if (payment.method === 'Cash' && payment.cashReceived > payment.amount) {
    line += `\n  Cash Received: $${payment.cashReceived.toFixed(2)} | Change Given: $${payment.change.toFixed(2)}`;
  }
  if (payment.notes) line += `\n  Notes: ${payment.notes}`;
  return line;
}).join('\n')}

─────────────────────────────────────────────────────────
Generated: ${bill.generatedAt}
Reservation ID: ${bill.reservationId}
Thank you for staying with us!
═══════════════════════════════════════════════════════════
    `;

    // Download as text file
    const blob = new Blob([billContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Receipt_${bill.guestName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const quickPayFull = () => {
    const due = getBalanceDue();
    setPaymentAmount(due.toString());
    setCashReceived(due.toString());
  };

  if (loading) {
    return (
      <div className="view-reservation-scope">
        <div className="reservation-details-container">
          <div className="reservation-card">
            <div className="loading-container">
              <Clock className="loading-spinner" />
              <p className="loading-text">Loading reservation details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="view-reservation-scope">
      <div className="reservation-details-container">
        <div className="reservation-card fade-in">
          <div className="reservation-header">
            <h2>
              <User />
              Reservation Details
            </h2>
            <button onClick={onBackToEdit} className="back-button">
              ← Back to Edit
            </button>
          </div>

          <div className="details-grid">
            {/* Guest Information */}
            <div className="section-card guest-info-card slide-up">
              <h3 className="section-header">
                <User />
                Guest Information
              </h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Name:</span>
                  <span className="info-value font-semibold">
                    {formData.firstName} {formData.middleName} {formData.surname}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Phone:</span>
                  <span className="info-value">{formData.mobile}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{formData.email || "N/A"}</span>
                </div>
                <div className="info-item">
                  
                  <span className="info-label">Check-Out:</span>
                  <span className="info-value">{formData.checkOut}</span>
                </div>
                <div className="info-item">
                  
                  <span className="info-label">Duration:</span>
                  <span className="info-value">{formData.duration} nights</span>
                </div>
                <div className="info-item">
                  
                  <span className="info-label">Guests:</span>
                  <span className="info-value">{formData.adults} Adults, {formData.kids} Kids</span>
                </div>
                <div className="info-item">
                  
                  <span className="info-label">ID:</span>
                  <span className="info-value">{formData.idType}: {formData.idNumber}</span>
                </div>
              </div>
            </div>

            {/* Booked Rooms */}
            <div className="section-card rooms-card slide-up">
              <h3 className="section-header">
                <Bed />
                Booked Rooms
              </h3>
              {roomDetails.length > 0 ? (
                <div>
                  {roomDetails.map(room => {
                    const roomPrice = room.RPrice || room.Price || 0;
                    const totalPrice = roomPrice * parseInt(formData.duration);
                    return (
                      <div key={room.RoomNo} className="room-item">
                        <div className="room-header">
                          <div>
                            <h4 className="room-number">Room {room.RoomNo}</h4>
                            <p className="room-type">{room.RType} - {room.RClass}</p>
                            <p className="room-rate">${roomPrice.toFixed(2)} per night</p>
                          </div>
                          <div className="room-price">
                            <p className="room-total">${totalPrice.toFixed(2)}</p>
                            <p className="room-rate">{formData.duration} nights</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div className="total-charges">
                    <div className="total-charges-label">Total Room Charges:</div>
                    <div className="total-charges-amount">
                      ${calculateTotalRoomCharges().toFixed(2)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <Bed className="empty-icon" />
                  <p className="empty-title">No room details available</p>
                  <p className="empty-description">
                    Selected rooms: {mockSelectedReservation?.selectedRooms?.join(', ') || 'None'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Payment Summary */}
          <div className="details-grid full-width">
            <div className="section-card payment-card slide-up">
              <h3 className="section-header">
                <DollarSign />
                Payment Summary
              </h3>
              <div className="payment-summary-grid">
                <div className="payment-summary-item total">
                  <div className="payment-summary-label">Total Bill</div>
                  <div className="payment-summary-value neutral">${getTotalAmount().toFixed(2)}</div>
                </div>
                
                <div className="payment-summary-item paid">
                  <div className="payment-summary-label">Total Paid</div>
                  <div className="payment-summary-value positive">${getTotalPaid().toFixed(2)}</div>
                </div>
                
                <div className="payment-summary-item due">
                  <div className="payment-summary-label">Balance Due</div>
                  <div className={`payment-summary-value ${
                    getBalanceDue() > 0 ? 'negative' : 
                    getBalanceDue() < 0 ? 'overpaid' : 
                    'positive'
                  }`}>
                    ${Math.abs(getBalanceDue()).toFixed(2)}
                  </div>
                </div>
                
                <div className="payment-summary-item status">
                  <div className="payment-summary-label">Status</div>
                  <span className={`payment-status-badge ${getPaymentStatusClass()}`}>
                    {getPaymentStatus()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="details-grid">
            {/* Payment History */}
            <div className="section-card slide-up">
              <h3 className="section-header">
                <Receipt />
                Payment History
              </h3>
              {paymentHistory.length > 0 ? (
                <div>
                  {paymentHistory.map((payment, index) => (
                    <div key={index} className="payment-history-item">
                      <div className="payment-history-header">
                        <div>
                          <p className="payment-amount">${payment.amount.toFixed(2)}</p>
                          <p className="payment-date">{new Date(payment.date).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="payment-method-badge">
                            {payment.method}
                          </span>
                        </div>
                      </div>
                      {payment.method === 'Cash' && payment.cashReceived > payment.amount && (
                        <div className="cash-details">
                          <p className="cash-details-text">
                            Cash Received: ${payment.cashReceived.toFixed(2)} | 
                            Change Given: ${payment.change.toFixed(2)}
                          </p>
                        </div>
                      )}
                      {payment.notes && (
                        <p className="payment-notes">{payment.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <Receipt className="empty-icon" />
                  <p className="empty-title">No payment history available</p>
                </div>
              )}
            </div>

            {/* Enhanced Record Payment */}
            <div className="section-card slide-up">
              <h3 className="section-header">
                <CreditCard />
                Record Payment
              </h3>
              
              {getBalanceDue() > 0 && (
                <div className="quick-pay-section">
                  <p className="quick-pay-text">
                    Amount Due: ${getBalanceDue().toFixed(2)}
                  </p>
                  <button onClick={quickPayFull} className="quick-pay-button">
                    Pay Full Amount
                  </button>
                </div>
              )}
              
              <div className="payment-form">
                <div className="payment-form-field">
                  <label className="payment-form-label">
                    Payment Amount ($)
                  </label>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="payment-form-input"
                    min="0.01"
                    step="0.01"
                    placeholder={`Max: ${getBalanceDue().toFixed(2)}`}
                  />
                </div>
                
                <div className="payment-form-field">
                  <label className="payment-form-label">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value);
                      setShowCashCalculator(e.target.value === "Cash");
                    }}
                    className="payment-form-select"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Cash Calculator */}
                {(paymentMethod === "Cash" || showCashCalculator) && (
                  <div className="cash-calculator">
                    <h4 className="cash-calculator-header">
                      <Calculator />
                      Cash Calculator
                    </h4>
                    <div className="payment-form-field">
                      <label className="payment-form-label">
                        Cash Received from Guest ($)
                      </label>
                      <input
                        type="number"
                        value={cashReceived}
                        onChange={(e) => setCashReceived(e.target.value)}
                        className="payment-form-input"
                        min="0.01"
                        step="0.01"
                        placeholder="e.g., 500 (for $500 bill)"
                      />
                    </div>
                    {cashReceived && paymentAmount && (
                      <div className="change-display">
                        <span className="change-label">Change to Give:</span>
                        <span className={`change-amount ${
                          calculateChange() >= 0 ? 'positive' : 'negative'
                        }`}>
                          ${Math.abs(calculateChange()).toFixed(2)}
                          {calculateChange() < 0 && ' (Insufficient Cash)'}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="payment-form-field">
                  <label className="payment-form-label">
                    Notes
                  </label>
                  <textarea
                    value={paymentNotes}
                    onChange={(e) => setPaymentNotes(e.target.value)}
                    className="payment-form-textarea"
                    placeholder="Optional notes"
                  />
                </div>
                
                <button
                  onClick={handlePayment}
                  className="btn btn-secondary btn-full-width"
                  disabled={!paymentAmount || parseFloat(paymentAmount) <= 0 || 
                            (paymentMethod === "Cash" && parseFloat(cashReceived) < parseFloat(paymentAmount))}
                >
                  <DollarSign />
                  Record Payment
                </button>
                
                {paymentMethod === "Cash" && cashReceived && paymentAmount && calculateChange() > 0 && (
                  <div className="alert warning mt-3">
                    💡 Remember to give ${calculateChange().toFixed(2)} change to the guest!
                  </div>
                )}
                
                {getBalanceDue() <= 0 && (
                  <div className="alert success mt-3">
                    <CheckCircle />
                    {getBalanceDue() < 0 ? 
                      `Guest has overpaid by ${Math.abs(getBalanceDue()).toFixed(2)}` : 
                      'Payment is complete - Ready for checkout!'
                    }
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bill Generation Section */}
          <div className="bill-section">
            <div className="section-card bill-card slide-up">
              <h3 className="section-header">
                <FileText />
                Generate Bill
              </h3>
              <p className="bill-description">
                Download a detailed receipt for this reservation
              </p>
              <button onClick={generateBill} className="btn btn-info">
                <Download />
                Download Receipt
              </button>
            </div>
          </div>

          {/* Checkout Section */}
          <div className="mt-6">
            {getBalanceDue() > 0 ? (
              <div className="status-card payment-required">
                <div className="status-icon warning">
                  <AlertCircle />
                </div>
                <h3 className="status-title warning">
                  Payment Required Before Checkout
                </h3>
                <p className="status-description">
                  Outstanding Balance: 
                </p>
                <div className="status-amount">${getBalanceDue().toFixed(2)}</div>
                <button
                  onClick={() => {
                    document.querySelector('.payment-form-input')?.focus();
                  }}
                  className="btn btn-warning"
                >
                  <DollarSign />
                  Complete Payment (${getBalanceDue().toFixed(2)} Due)
                </button>
              </div>
            ) : (
              <div className="status-card ready-checkout">
                <div className="status-icon success">
                  <CheckCircle />
                </div>
                <h3 className="status-title success">
                  {getBalanceDue() < 0 ? 
                    `Guest Overpaid - Credit: ${Math.abs(getBalanceDue()).toFixed(2)}` :
                    'Payment Complete - Ready for Checkout'
                  }
                </h3>
                <p className="status-description">
                  {getBalanceDue() < 0 ? 
                    'Consider refunding the excess amount to the guest' :
                    'All payments have been received'
                  }
                </p>
                <button onClick={handleCheckout} className="btn btn-success">
                  <LogOut />
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>

          {/* Checkout Confirmation Dialog */}
          {showCheckoutDialog && (
            <div className="modal-overlay">
              <div className="modal-content slide-up">
                <div className="modal-header">
                  <LogOut />
                  <h3 className="modal-title">Checkout Confirmation</h3>
                </div>
                
                <div className="modal-body">
                  <p>
                    Are you sure you want to checkout <strong>{formData.firstName} {formData.surname}</strong>?
                  </p>
                  
                  <div className="checkout-details">
                    <h4>This will:</h4>
                    <ul>
                      <li>Mark all booked rooms as vacant</li>
                      <li>Complete the reservation</li>
                      <li>Update room availability</li>
                    </ul>
                  </div>
                  
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      id="wantBill"
                      checked={wantBill}
                      onChange={(e) => setWantBill(e.target.checked)}
                      className="checkbox-input"
                    />
                    <label htmlFor="wantBill" className="checkbox-label">
                      Generate and download receipt for guest
                    </label>
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button
                    onClick={() => setShowCheckoutDialog(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmCheckout}
                    className="btn btn-primary"
                  >
                    <CheckCircle />
                    Confirm Checkout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewReservationDetails;