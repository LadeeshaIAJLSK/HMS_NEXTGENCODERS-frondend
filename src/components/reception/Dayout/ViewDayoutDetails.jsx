import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewDayoutDetails.css';

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
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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

  // Show success popup in center of screen
  const showCenterSuccessPopup = (message) => {
    setSuccessMessage(message);
    setShowSuccessPopup(true);
    setTimeout(() => {
      setShowSuccessPopup(false);
    }, 3000);
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

      // Ensure paymentHistory is an array before spreading
      const currentPaymentHistory = Array.isArray(paymentHistory) ? paymentHistory : [];
      setPaymentHistory([...currentPaymentHistory, response.data]);
      
      showCenterSuccessPopup('Payment recorded successfully! 💰');
      setShowPaymentForm(false);
      setPaymentData({ amount: '', method: 'Cash', notes: '', cashReceived: '' });
      
      // Refresh reservation data
      setTimeout(() => {
        window.location.reload();
      }, 2000);
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

      showCenterSuccessPopup('Day-out reservation completed successfully! 🎉');
      setTimeout(() => {
        onCheckoutComplete();
      }, 2500);
    } catch (error) {
      console.error('Error completing reservation:', error);
      onError(error.response?.data?.message || 'Error completing reservation');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="vdd-container-fluid">
      {/* Success Popup Modal */}
      {showSuccessPopup && (
        <div className="vdd-success-modal-overlay">
          <div className="vdd-success-modal">
            <div className="vdd-success-modal-content">
              <div className="vdd-success-icon-large">✅</div>
              <h3 className="vdd-success-title">Success!</h3>
              <p className="vdd-success-text">{successMessage}</p>
              <div className="vdd-success-loader">
                <div className="vdd-loader-bar"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="vdd-header">
        <h2 className="vdd-title"> Day-Out Reservation Details</h2>
        <div className="vdd-btn-group">
          <button className="vdd-btn vdd-btn-outline-secondary" onClick={onBackToEdit}>
             Edit Reservation
          </button>
          {selectedReservation?.status !== 'Completed' && amountDue === 0 && (
            <button 
              className="vdd-btn vdd-btn-success" 
              onClick={handleCheckout}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Complete Reservation'}
            </button>
          )}
        </div>
      </div>

      {/* Reservation Status */}
      <div className="vdd-row vdd-mb-4">
        <div className="vdd-col-12">
          <div className="vdd-card">
            <div className="vdd-card-body">
              <div className="vdd-status-grid">
                <div className="vdd-status-item">
                  <h6 className="vdd-status-label">Reservation Status</h6>
                  <span className={`vdd-badge vdd-status-${selectedReservation?.status?.toLowerCase() || 'unknown'}`}>
                    {selectedReservation?.status || 'Unknown'}
                  </span>
                </div>
                <div className="vdd-status-item">
                  <h6 className="vdd-status-label">Payment Status</h6>
                  <span className={`vdd-badge vdd-payment-${selectedReservation?.paymentStatus?.replace(' ', '-').toLowerCase() || 'unknown'}`}>
                    {selectedReservation?.paymentStatus || 'Unknown'}
                  </span>
                </div>
                <div className="vdd-status-item">
                  <h6 className="vdd-status-label">Reservation ID</h6>
                  <code className="vdd-code">{selectedReservation?._id}</code>
                </div>
                <div className="vdd-status-item">
                  <h6 className="vdd-status-label">Created On</h6>
                  <span>{formatDate(selectedReservation?.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visit Information */}
      <div className="vdd-row vdd-mb-4">
        <div className="vdd-col-12">
          <div className="vdd-card">
            <div className="vdd-card-header">
              <h5 className="vdd-card-title">Visit Information</h5>
            </div>
            <div className="vdd-card-body">
              <div className="vdd-info-grid">
                <div className="vdd-info-item">
                  <strong>Visit Date:</strong> {formatDate(formData.checkIn)}
                </div>
                <div className="vdd-info-item">
                  <strong>Time:</strong> {selectedReservation?.startTime} - {selectedReservation?.endTime}
                </div>
                <div className="vdd-info-item">
                  <strong>Duration:</strong> {selectedReservation?.duration} hours
                </div>
                <div className="vdd-info-item">
                  <strong>Adults:</strong> {formData.adults}
                </div>
                <div className="vdd-info-item">
                  <strong>Kids:</strong> {formData.kids}
                </div>
                <div className="vdd-info-item">
                  <strong>Total Guests:</strong> {parseInt(formData.adults) + parseInt(formData.kids)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guest Information */}
      <div className="vdd-row vdd-mb-4">
        <div className="vdd-col-md-6">
          <div className="vdd-card">
            <div className="vdd-card-header">
              <h5 className="vdd-card-title"> Primary Guest Information</h5>
            </div>
            <div className="vdd-card-body">
              <div className="vdd-guest-info">
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
        </div>

        {/* Other Persons */}
        {selectedReservation?.otherPersons && selectedReservation.otherPersons.length > 0 && (
          <div className="vdd-col-md-6">
            <div className="vdd-card">
              <div className="vdd-card-header">
                <h5 className="vdd-card-title"> Other Persons</h5>
              </div>
              <div className="vdd-card-body">
                {selectedReservation.otherPersons.map((person, index) => (
                  <div key={index} className="vdd-person-card">
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
      <div className="vdd-row vdd-mb-4">
        <div className="vdd-col-12">
          <div className="vdd-card">
            <div className="vdd-card-header">
              <h5 className="vdd-card-title"> Selected Packages</h5>
            </div>
            <div className="vdd-card-body">
              {packageDetails && packageDetails.length > 0 ? (
                <div className="vdd-packages-grid">
                  {packageDetails.map((pkg, index) => (
                    <div key={index} className="vdd-package-card">
                      <div className="vdd-package-body">
                        <h6 className="vdd-package-title">{pkg.name}</h6>
                        <p className="vdd-package-description">{pkg.description}</p>
                        <p><strong>Category:</strong> {pkg.category}</p>
                        <p><strong>Price:</strong> {formatCurrency(pkg.pricePerChild)} per person</p>
                        {pkg.features && pkg.features.length > 0 && (
                          <div>
                            <strong>Features:</strong>
                            <ul className="vdd-features-list">
                              {pkg.features.map((feature, fIndex) => (
                                <li key={fIndex}>{feature}</li>
                              ))}
                            </ul>
                          </div>
                        )}
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
      <div className="vdd-row vdd-mb-4">
        <div className="vdd-col-md-8">
          <div className="vdd-card">
            <div className="vdd-card-header vdd-payment-header">
              <h5 className="vdd-card-title"> Payment Information</h5>
              {amountDue > 0 && (
                <button 
                  className="vdd-btn vdd-btn-primary vdd-btn-sm"
                  onClick={() => setShowPaymentForm(!showPaymentForm)}
                >
                  {showPaymentForm ? 'Cancel' : '💰 Record Payment'}
                </button>
              )}
            </div>
            <div className="vdd-card-body">
              <div className="vdd-payment-summary">
                <div className="vdd-payment-item">
                  <strong>Total Amount:</strong>
                  <div className="vdd-amount vdd-amount-total">{formatCurrency(totalAmount)}</div>
                </div>
                <div className="vdd-payment-item">
                  <strong>Paid Amount:</strong>
                  <div className="vdd-amount vdd-amount-paid">{formatCurrency(paidAmount)}</div>
                </div>
                <div className="vdd-payment-item">
                  <strong>Amount Due:</strong>
                  <div className={`vdd-amount ${amountDue > 0 ? 'vdd-amount-due' : 'vdd-amount-paid'}`}>
                    {formatCurrency(amountDue)}
                  </div>
                </div>
              </div>

              {/* Payment Progress Bar */}
              <div className="vdd-progress-container">
                <div className="vdd-progress-info">
                  <small>Payment Progress</small>
                  <small>{paymentProgress}%</small>
                </div>
                <div className="vdd-progress">
                  <div 
                    className={`vdd-progress-bar ${paymentProgress === 100 ? 'vdd-progress-complete' : 'vdd-progress-partial'}`}
                    style={{ width: `${paymentProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Payment Form */}
              {showPaymentForm && (
                <form onSubmit={handlePaymentSubmit} className="vdd-payment-form">
                  <h6 className="vdd-form-title">Record New Payment</h6>
                  <div className="vdd-form-grid">
                    <div className="vdd-form-group">
                      <label className="vdd-form-label">Amount *</label>
                      <div className="vdd-input-group">
                        <span className="vdd-input-group-text">Rs</span>
                        <input
                          type="number"
                          className="vdd-form-control"
                          value={paymentData.amount}
                          onChange={(e) => setPaymentData(prev => ({...prev, amount: e.target.value}))}
                          max={amountDue}
                          step="0.01"
                          required
                        />
                      </div>
                    </div>
                    <div className="vdd-form-group">
                      <label className="vdd-form-label">Payment Method *</label>
                      <select
                        className="vdd-form-control"
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
                      <div className="vdd-form-group">
                        <label className="vdd-form-label">Cash Received</label>
                        <div className="vdd-input-group">
                          <span className="vdd-input-group-text">Rs</span>
                          <input
                            type="number"
                            className="vdd-form-control"
                            value={paymentData.cashReceived}
                            onChange={(e) => setPaymentData(prev => ({...prev, cashReceived: e.target.value}))}
                            step="0.01"
                          />
                        </div>
                        {paymentData.cashReceived && paymentData.amount && (
                          <small className="vdd-text-muted">
                            Change: {formatCurrency(parseFloat(paymentData.cashReceived) - parseFloat(paymentData.amount))}
                          </small>
                        )}
                      </div>
                    )}
                    <div className="vdd-form-group vdd-form-group-full">
                      <label className="vdd-form-label">Notes</label>
                      <textarea
                        className="vdd-form-control"
                        value={paymentData.notes}
                        onChange={(e) => setPaymentData(prev => ({...prev, notes: e.target.value}))}
                        rows="2"
                        placeholder="Payment notes (optional)"
                      />
                    </div>
                    <div className="vdd-form-actions">
                      <button 
                        type="submit" 
                        className="vdd-btn vdd-btn-primary"
                        disabled={isProcessing}
                      >
                        {isProcessing ? 'Processing...' : 'Record Payment'}
                      </button>
                      <button 
                        type="button" 
                        className="vdd-btn vdd-btn-secondary"
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
        <div className="vdd-col-md-4">
          <div className="vdd-card">
            <div className="vdd-card-header">
              <h5 className="vdd-card-title"> Payment History</h5>
            </div>
            <div className="vdd-card-body">
              {Array.isArray(paymentHistory) && paymentHistory.length > 0 ? (
                <div className="vdd-timeline">
                  {paymentHistory.map((payment, index) => (
                    <div key={index} className="vdd-timeline-item">
                      <div className="vdd-payment-amount">{formatCurrency(payment.amount)}</div>
                      <small className="vdd-payment-meta">
                        {payment.method} • {formatDate(payment.date)}
                      </small>
                      {payment.notes && (
                        <div className="vdd-payment-notes">{payment.notes}</div>
                      )}
                      {payment.cashReceived && (
                        <div className="vdd-payment-cash">
                          Cash: {formatCurrency(payment.cashReceived)} 
                          | Change: {formatCurrency(payment.change || 0)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="vdd-no-data">No payment history</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDayoutDetails;