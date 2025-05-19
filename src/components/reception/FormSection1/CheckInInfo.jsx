import React from 'react';

const CheckInInfo = ({ formData, handleFormChange }) => {
  return (
    <div className="checkinform-form-container">
      <h2 className="checkinform-form-heading">Check In Information</h2>
      <div className="checkinform-form-grid">
        <div>
          <label className="checkinform-form-label">Check In</label>
          <input
            type="date"
            name="checkIn"
            className="checkinform-form-input"
            value={formData.checkIn}
            onChange={handleFormChange}
            required
          />
        </div>
        
        <div>
          <label className="checkinform-form-label">Check Out</label>
          <input
            type="date"
            name="checkOut"
            className="checkinform-form-input"
            value={formData.checkOut}
            onChange={handleFormChange}
            required
          />
        </div>
        
        <div>
          <label className="checkinform-form-label">Duration of Stay</label>
          <input
            type="number"
            name="duration"
            className="checkinform-form-input"
            value={formData.duration}
            placeholder="Duration"
            disabled
          />
        </div>
        
        <div>
          <label className="checkinform-form-label">Adults</label>
          <input
            type="number"
            name="adults"
            className="checkinform-form-input"
            value={formData.adults}
            min="1"
            onChange={handleFormChange}
          />
        </div>
        
        <div>
          <label className="checkinform-form-label">Kids</label>
          <input
            type="number"
            name="kids"
            className="checkinform-form-input"
            value={formData.kids}
            min="0"
            onChange={handleFormChange}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckInInfo;