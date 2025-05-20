import React from "react";

const PaymentSection = ({
  amount,
  method,
  notes,
  onAmountChange,
  onMethodChange,
  onNotesChange,
  onSubmit,
  error,
  success
}) => {
  return (
    <div className="payment-section">
      <h2>Payment Processing</h2>
      
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      
      <div className="payment-form">
        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            value={amount}
            onChange={onAmountChange}
          />
        </div>
        
        <div className="form-group">
          <label>Method</label>
          <select value={method} onChange={onMethodChange}>
            <option value="Cash">Cash</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Notes</label>
          <textarea
            value={notes}
            onChange={onNotesChange}
          />
        </div>
        
        <button onClick={onSubmit}>Record Payment</button>
      </div>
    </div>
  );
};

export default PaymentSection;