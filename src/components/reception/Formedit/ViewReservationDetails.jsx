import React, { useState, useEffect } from "react";
import { Calculator, Receipt, CreditCard, DollarSign, AlertCircle, CheckCircle, Clock, User, MapPin, Calendar, Users, Bed, FileText, Download, LogOut } from "lucide-react";

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
      <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center py-8">
          <Clock className="mx-auto h-8 w-8 text-gray-400 animate-spin" />
          <p className="mt-2 text-gray-600">Loading reservation details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <User className="h-6 w-6" />
          Reservation Details
        </h2>
        <button
          onClick={onBackToEdit}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center gap-2"
        >
          ← Back to Edit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Guest Information */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-800">
            <User className="h-5 w-5" />
            Guest Information
          </h3>
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-gray-700">Name:</span>
                  <span className="text-gray-900">{formData.firstName} {formData.middleName} {formData.surname}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-gray-700">Phone:</span>
                  <span className="text-gray-900">{formData.mobile}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="text-gray-900">{formData.email || "N/A"}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-gray-700">Check-In:</span>
                  <span className="text-gray-900">{formData.checkIn}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-gray-700">Check-Out:</span>
                  <span className="text-gray-900">{formData.checkOut}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-gray-700">Duration:</span>
                  <span className="text-gray-900">{formData.duration} nights</span>
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-blue-200">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-gray-700">Guests:</span>
                  <span className="text-gray-900">{formData.adults} Adults, {formData.kids} Kids</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-gray-700">ID:</span>
                  <span className="text-gray-900">{formData.idType}: {formData.idNumber}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booked Rooms */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-green-800">
            <Bed className="h-5 w-5" />
            Booked Rooms
          </h3>
          {roomDetails.length > 0 ? (
            <div className="space-y-3">
              {roomDetails.map(room => {
                const roomPrice = room.RPrice || room.Price || 0;
                const totalPrice = roomPrice * parseInt(formData.duration);
                return (
                  <div key={room.RoomNo} className="bg-white p-4 rounded-lg border border-green-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-green-800">Room {room.RoomNo}</h4>
                        <p className="text-sm text-gray-600">{room.RType} - {room.RClass}</p>
                        <p className="text-sm text-gray-600">${roomPrice.toFixed(2)} per night</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-700">${totalPrice.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">{formData.duration} nights</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="bg-green-200 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-green-800">Total Room Charges:</span>
                  <span className="text-xl font-bold text-green-800">
                    ${calculateTotalRoomCharges().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Bed className="mx-auto h-12 w-12 text-gray-400" />
              <p className="text-gray-500 mt-2">No room details available</p>
              <p className="text-xs text-gray-400 mt-1">
                Selected rooms: {mockSelectedReservation?.selectedRooms?.join(', ') || 'None'}
              </p>
            </div>
          )}
        </div>

        {/* Enhanced Payment Summary */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border-2 border-purple-200 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-purple-800">
            <DollarSign className="h-5 w-5" />
            Payment Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total Bill</p>
                <p className="text-2xl font-bold text-purple-600">${getTotalAmount().toFixed(2)}</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total Paid</p>
                <p className="text-2xl font-bold text-green-600">${getTotalPaid().toFixed(2)}</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Balance Due</p>
                <p className={`text-2xl font-bold ${
                  getBalanceDue() > 0 ? 'text-red-600' : 
                  getBalanceDue() < 0 ? 'text-blue-600' : 
                  'text-green-600'
                }`}>
                  ${Math.abs(getBalanceDue()).toFixed(2)}
                </p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPaymentStatusColor()}`}>
                  {getPaymentStatus()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Payment History
          </h3>
          {paymentHistory.length > 0 ? (
            <div className="space-y-3">
              {paymentHistory.map((payment, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">${payment.amount.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">{new Date(payment.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                        {payment.method}
                      </span>
                    </div>
                  </div>
                  {payment.method === 'Cash' && payment.cashReceived > payment.amount && (
                    <div className="bg-green-50 p-2 rounded text-sm">
                      <p className="text-green-800">
                        Cash Received: ${payment.cashReceived.toFixed(2)} | 
                        Change Given: ${payment.change.toFixed(2)}
                      </p>
                    </div>
                  )}
                  {payment.notes && (
                    <p className="text-sm text-gray-600 mt-1">{payment.notes}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Receipt className="mx-auto h-12 w-12 text-gray-400" />
              <p className="text-gray-500 mt-2">No payment history available</p>
            </div>
          )}
        </div>

        {/* Enhanced Record Payment */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-orange-800">
            <CreditCard className="h-5 w-5" />
            Record Payment
          </h3>
          
          {getBalanceDue() > 0 && (
            <div className="mb-4 p-3 bg-orange-100 rounded-lg">
              <p className="text-orange-800 font-medium">
                Amount Due: ${getBalanceDue().toFixed(2)}
              </p>
              <button
                onClick={quickPayFull}
                className="mt-2 px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700"
              >
                Pay Full Amount
              </button>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Amount ($)
              </label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                min="0.01"
                step="0.01"
                placeholder={`Max: $${getBalanceDue().toFixed(2)}`}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  setShowCashCalculator(e.target.value === "Cash");
                }}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
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
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  Cash Calculator
                </h4>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cash Received from Guest ($)
                    </label>
                    <input
                      type="number"
                      value={cashReceived}
                      onChange={(e) => setCashReceived(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      min="0.01"
                      step="0.01"
                      placeholder="e.g., 500 (for $500 bill)"
                    />
                  </div>
                  {cashReceived && paymentAmount && (
                    <div className="bg-white p-3 rounded border">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Change to Give:</span>
                        <span className={`font-bold ${
                          calculateChange() >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          ${Math.abs(calculateChange()).toFixed(2)}
                          {calculateChange() < 0 && ' (Insufficient Cash)'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows="2"
                placeholder="Optional notes"
              />
            </div>
            
            <button
              onClick={handlePayment}
              className="w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
              disabled={!paymentAmount || parseFloat(paymentAmount) <= 0 || 
                        (paymentMethod === "Cash" && parseFloat(cashReceived) < parseFloat(paymentAmount))}
            >
              <DollarSign className="h-4 w-4" />
              Record Payment
            </button>
            
            {paymentMethod === "Cash" && cashReceived && paymentAmount && calculateChange() > 0 && (
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <p className="text-yellow-800 text-sm font-medium">
                  💡 Remember to give ${calculateChange().toFixed(2)} change to the guest!
                </p>
              </div>
            )}
            
            {getBalanceDue() <= 0 && (
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <p className="text-green-800 text-sm font-medium flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  {getBalanceDue() < 0 ? 
                    `Guest has overpaid by ${Math.abs(getBalanceDue()).toFixed(2)}` : 
                    'Payment is complete - Ready for checkout!'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bill Generation Section */}
      <div className="mt-6">
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-lg border border-indigo-200">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-indigo-800">
            <FileText className="h-5 w-5" />
            Generate Bill
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Download a detailed receipt for this reservation
          </p>
          <button
            onClick={generateBill}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Receipt
          </button>
        </div>
      </div>

      {/* Checkout Section */}
      <div className="mt-6">
        {getBalanceDue() > 0 ? (
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg border border-yellow-200">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-yellow-600 mb-3" />
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                Payment Required Before Checkout
              </h3>
              <p className="text-yellow-700 mb-4">
                Outstanding Balance: <span className="font-bold text-xl">${getBalanceDue().toFixed(2)}</span>
              </p>
              <button
                onClick={() => {
                  document.querySelector('input[type="number"]')?.focus();
                }}
                className="px-6 py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 font-medium flex items-center gap-2 mx-auto"
              >
                <DollarSign className="h-5 w-5" />
                Complete Payment (${getBalanceDue().toFixed(2)} Due)
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
            <div className="text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-600 mb-3" />
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                {getBalanceDue() < 0 ? 
                  `Guest Overpaid - Credit: ${Math.abs(getBalanceDue()).toFixed(2)}` :
                  'Payment Complete - Ready for Checkout'
                }
              </h3>
              <p className="text-green-700 mb-4">
                {getBalanceDue() < 0 ? 
                  'Consider refunding the excess amount to the guest' :
                  'All payments have been received'
                }
              </p>
              <button
                onClick={handleCheckout}
                className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium flex items-center gap-2 mx-auto"
              >
                <LogOut className="h-5 w-5" />
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Confirmation Dialog */}
      {showCheckoutDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <LogOut className="h-5 w-5" />
              Checkout Confirmation
            </h3>
            
            <div className="space-y-4">
              <p className="text-gray-700">
                Are you sure you want to checkout <strong>{formData.firstName} {formData.surname}</strong>?
              </p>
              
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-600 mb-2">This will:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Mark all booked rooms as vacant</li>
                  <li>• Complete the reservation</li>
                  <li>• Update room availability</li>
                </ul>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="wantBill"
                  checked={wantBill}
                  onChange={(e) => setWantBill(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="wantBill" className="text-sm text-gray-700">
                  Generate and download receipt for guest
                </label>
              </div>
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowCheckoutDialog(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmCheckout}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Confirm Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewReservationDetails;