import React from 'react';

const PaymentInfo = ({ formData, handleFormChange }) => {
  return (
    <div className="checkinform-form-container">
      <h2 className="checkinform-form-heading">Payment Information</h2>
      <div className="checkinform-form-grid">
        <div>
          <label className="checkinform-form-label">Advance Payment (Rs.) <span className="asterisk">*</span></label>
          <input
            type="number"
            name="advancePayment"
            className="checkinform-form-input"
            value={formData.advancePayment}
            onChange={handleFormChange}
            placeholder="Enter amount"
            min="0"
            step="0.01"
            required
          />
        </div>
        
        <div>
          <label className="checkinform-form-label">Payment Method <span className="asterisk">*</span></label>
          <select
            name="paymentMethod"
            className="checkinform-form-input"
            value={formData.paymentMethod}
            onChange={handleFormChange}
            required
          >
            <option value="">--Select Payment Method--</option>
            <option value="Cash">Cash</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="UPI">UPI</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div className="full-width">
          <label className="checkinform-form-label">Payment Notes</label>
          <textarea
            name="paymentNotes"
            className="checkinform-form-input"
            value={formData.paymentNotes}
            onChange={handleFormChange}
            placeholder="Any additional payment information"
            rows="2"
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default PaymentInfo;