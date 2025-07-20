import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewDayoutDetails = ({
  selectedReservation,
  formData,
  packageDetails,
  paymentHistory,
  setPaymentHistory,
  onBackToEdit,
  onSuccess,
  onError,
  onCheckoutComplete
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    method: 'Cash',
    notes: '',
    cashReceived: ''
  });
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  // Calculate amounts
  const totalAmount = selectedReservation?.totalAmount || 0;
  const paidAmount = selectedReservation?.paidAmount || 0;
  const amountDue = totalAmount - paidAmount;
  const paymentProgress = totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0;

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `Rs ${(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  // Handle payment submission
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!paymentData.amount || parseFloat(paymentData.amount) <= 0) {
      onError('Please enter a valid payment amount');
      return;
    }

    if (parseFloat(paymentData.amount) > amountDue) {
      onError('Payment amount cannot exceed amount due');
      return;
    }

    if (paymentData.method === 'Cash' && paymentData.cashReceived && parseFloat(paymentData.cashReceived) < parseFloat(paymentData.amount)) {
      onError('Cash received cannot be less than payment amount');
      return;
    }

    setIsProcessing(true);

    try {
      const response = await axios.post(
        `http://localhost:8000/api/reservations/${selectedReservation._id}/payments`,
        {
          amount: parseFloat(paymentData.amount),
          method: paymentData.method,
          notes: paymentData.notes,
          cashReceived: paymentData.method === 'Cash' ? parseFloat(paymentData.cashReceived) || parseFloat(paymentData.amount) : null
        }
      );

      setPaymentHistory([...paymentHistory, response.data]);
      onSuccess('Payment recorded successfully!');
      setShowPaymentForm(false);
      setPaymentData({ amount: '', method: 'Cash', notes: '', cashReceived: '' });
      
      // Refresh reservation data
      window.location.reload();
    } catch (error) {
      console.error('Error recording payment:', error);
      onError(error.response?.data?.message || 'Error recording payment');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle checkout
  const handleCheckout = async () => {
    if (amountDue > 0) {
      onError('Cannot complete checkout with pending payments');
      return;
    }

    if (!window.confirm('Are you sure you want to complete this day-out reservation?')) {
      return;
    }

    setIsProcessing(true);

    try {
      await axios.patch(`http://localhost:8000/api/reservations/${selectedReservation._id}/checkout`, {
        notes: 'Day-out reservation completed'
      });

      onSuccess('Day-out reservation completed successfully!');
      onCheckoutComplete();
    } catch (error) {
      console.error('Error completing reservation:', error);
      onError(error.response?.data?.message || 'Error completing reservation');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container-fluid px-4 py-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🏖️ Day-Out Reservation Details</h2>
        <div className="btn-group">
          <button className="btn btn-outline-secondary" onClick={onBackToEdit}>
            ✏️ Edit Reservation
          </button>
          {selectedReservation?.status !== 'Completed' && amountDue === 0 && (
            <button 
              className="btn btn-success" 
              onClick={handleCheckout}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : '✅ Complete Reservation'}
            </button>
          )}
        </div>
      </div>

      {/* Reservation Status */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-md-3">
                  <h6>Reservation Status</h6>
                  <span className={`badge fs-6 ${
                    selectedReservation?.status === 'Completed' ? 'bg-success' :
                    selectedReservation?.status === 'Confirmed' ? 'bg-primary' :
                    selectedReservation?.status === 'Pending' ? 'bg-warning' :
                    selectedReservation?.status === 'Cancelled' ? 'bg-danger' : 'bg-secondary'
                  }`}>
                    {selectedReservation?.status || 'Unknown'}
                  </span>
                </div>
                <div className="col-md-3">
                  <h6>Payment Status</h6>
                  <span className={`badge fs-6 ${
                    selectedReservation?.paymentStatus === 'Fully Paid' ? 'bg-success' :
                    selectedReservation?.paymentStatus === 'Partially Paid' ? 'bg-warning' :
                    selectedReservation?.paymentStatus === 'Pending' ? 'bg-danger' : 'bg-secondary'
                  }`}>
                    {selectedReservation?.paymentStatus || 'Unknown'}
                  </span>
                </div>
                <div className="col-md-3">
                  <h6>Reservation ID</h6>
                  <code>{selectedReservation?._id}</code>
                </div>
                <div className="col-md-3">
                  <h6>Created On</h6>
                  <span>{formatDate(selectedReservation?.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visit Information */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5>📅 Visit Information</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <strong>Visit Date:</strong> {formatDate(formData.checkIn)}
                </div>
                <div className="col-md-4">
                  <strong>Time:</strong> {selectedReservation?.startTime} - {selectedReservation?.endTime}
                </div>
                <div className="col-md-4">
                  <strong>Duration:</strong> {selectedReservation?.duration} hours
                </div>
                <div className="col-md-4 mt-2">
                  <strong>Adults:</strong> {formData.adults}
                </div>
                <div className="col-md-4 mt-2">
                  <strong>Kids:</strong> {formData.kids}
                </div>
                <div className="col-md-4 mt-2">
                  <strong>Total Guests:</strong> {parseInt(formData.adults) + parseInt(formData.kids)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guest Information */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>👤 Primary Guest Information</h5>
            </div>
            <div className="card-body">
              <p><strong>Name:</strong> {formData.firstName} {formData.middleName} {formData.surname}</p>
              <p><strong>Mobile:</strong> {formData.mobile}</p>
              <p><strong>Email:</strong> {formData.email || 'Not provided'}</p>
              <p><strong>Date of Birth:</strong> {formatDate(formData.dob)}</p>
              <p><strong>Gender:</strong> {formData.gender || 'Not specified'}</p>
              <p><strong>Address:</strong> {formData.address}</p>
              <p><strong>City:</strong> {formData.city || 'Not specified'}</p>
              {formData.idType && (
                <>
                  <p><strong>ID Type:</strong> {formData.idType}</p>
                  <p><strong>ID Number:</strong> {formData.idNumber}</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Other Persons */}
        {selectedReservation?.otherPersons && selectedReservation.otherPersons.length > 0 && (
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h5>👥 Other Persons</h5>
              </div>
              <div className="card-body">
                {selectedReservation.otherPersons.map((person, index) => (
                  <div key={index} className="mb-3 p-2 border rounded">
                    <p><strong>Name:</strong> {person.name || 'Not provided'}</p>
                    <p><strong>Gender:</strong> {person.gender || 'Not specified'}</p>
                    <p><strong>Age:</strong> {person.age || 'Not specified'}</p>
                    {person.idType && <p><strong>ID:</strong> {person.idType} - {person.idNo}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Package Details */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5>📦 Selected Packages</h5>
            </div>
            <div className="card-body">
              {packageDetails && packageDetails.length > 0 ? (
                <div className="row">
                  {packageDetails.map((pkg, index) => (
                    <div key={index} className="col-md-6 mb-3">
                      <div className="card">
                        <div className="card-body">
                          <h6 className="card-title">{pkg.name}</h6>
                          <p className="card-text">{pkg.description}</p>
                          <p><strong>Category:</strong> {pkg.category}</p>
                          <p><strong>Price:</strong> {formatCurrency(pkg.pricePerChild)} per person</p>
                          {pkg.features && pkg.features.length > 0 && (
                            <div>
                              <strong>Features:</strong>
                              <ul className="mt-1">
                                {pkg.features.map((feature, fIndex) => (
                                  <li key={fIndex}>{feature}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No packages selected</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="row mb-4">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5>💳 Payment Information</h5>
              {amountDue > 0 && (
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowPaymentForm(!showPaymentForm)}
                >
                  {showPaymentForm ? 'Cancel' : '💰 Record Payment'}
                </button>
              )}
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-4">
                  <strong>Total Amount:</strong>
                  <div className="fs-5 text-primary">{formatCurrency(totalAmount)}</div>
                </div>
                <div className="col-md-4">
                  <strong>Paid Amount:</strong>
                  <div className="fs-5 text-success">{formatCurrency(paidAmount)}</div>
                </div>
                <div className="col-md-4">
                  <strong>Amount Due:</strong>
                  <div className={`fs-5 ${amountDue > 0 ? 'text-danger' : 'text-success'}`}>
                    {formatCurrency(amountDue)}
                  </div>
                </div>
              </div>

              {/* Payment Progress Bar */}
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <small>Payment Progress</small>
                  <small>{paymentProgress}%</small>
                </div>
                <div className="progress">
                  <div 
                    className={`progress-bar ${paymentProgress === 100 ? 'bg-success' : 'bg-primary'}`}
                    role="progressbar" 
                    style={{ width: `${paymentProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Payment Form */}
              {showPaymentForm && (
                <form onSubmit={handlePaymentSubmit} className="border-top pt-3">
                  <h6>Record New Payment</h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Amount *</label>
                      <div className="input-group">
                        <span className="input-group-text">Rs</span>
                        <input
                          type="number"
                          className="form-control"
                          value={paymentData.amount}
                          onChange={(e) => setPaymentData(prev => ({...prev, amount: e.target.value}))}
                          max={amountDue}
                          step="0.01"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Payment Method *</label>
                      <select
                        className="form-control"
                        value={paymentData.method}
                        onChange={(e) => setPaymentData(prev => ({...prev, method: e.target.value}))}
                        required
                      >
                        <option value="Cash">Cash</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="Debit Card">Debit Card</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="UPI">UPI</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    {paymentData.method === 'Cash' && (
                      <div className="col-md-6">
                        <label className="form-label">Cash Received</label>
                        <div className="input-group">
                          <span className="input-group-text">Rs</span>
                          <input
                            type="number"
                            className="form-control"
                            value={paymentData.cashReceived}
                            onChange={(e) => setPaymentData(prev => ({...prev, cashReceived: e.target.value}))}
                            step="0.01"
                          />
                        </div>
                        {paymentData.cashReceived && paymentData.amount && (
                          <small className="text-muted">
                            Change: {formatCurrency(parseFloat(paymentData.cashReceived) - parseFloat(paymentData.amount))}
                          </small>
                        )}
                      </div>
                    )}
                    <div className="col-md-12">
                      <label className="form-label">Notes</label>
                      <textarea
                        className="form-control"
                        value={paymentData.notes}
                        onChange={(e) => setPaymentData(prev => ({...prev, notes: e.target.value}))}
                        rows="2"
                        placeholder="Payment notes (optional)"
                      />
                    </div>
                    <div className="col-md-12">
                      <button 
                        type="submit" 
                        className="btn btn-primary me-2"
                        disabled={isProcessing}
                      >
                        {isProcessing ? 'Processing...' : 'Record Payment'}
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={() => setShowPaymentForm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5>📜 Payment History</h5>
            </div>
            <div className="card-body">
              {paymentHistory && paymentHistory.length > 0 ? (
                <div className="timeline">
                  {paymentHistory.map((payment, index) => (
                    <div key={index} className="mb-3 p-2 border-start border-primary border-3 ps-3">
                      <div className="fw-bold">{formatCurrency(payment.amount)}</div>
                      <small className="text-muted">
                        {payment.method} • {formatDate(payment.date)}
                      </small>
                      {payment.notes && (
                        <div className="small text-muted mt-1">{payment.notes}</div>
                      )}
                      {payment.cashReceived && (
                        <div className="small text-muted">
                          Cash: {formatCurrency(payment.cashReceived)} 
                          | Change: {formatCurrency(payment.change || 0)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No payment history</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDayoutDetails;