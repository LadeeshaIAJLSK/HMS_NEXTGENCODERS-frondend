import React, { useState, useEffect } from "react";
import "./CheckInForm.css"; // Import styles

const CheckInForm = () => {
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    duration: "",
    adults: "1",
    kids: "0",
  });

  useEffect(() => {
    calculateDuration();
  }, [formData.checkIn, formData.checkOut]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateDuration = () => {
    const { checkIn, checkOut } = formData;
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      setFormData((prev) => ({ ...prev, duration: diff > 0 ? diff : "" }));
    }
  };

  const getTextColor = (value) => (value ? "#000000" : "#718096");

  return (
    <form className="form-container">
      <h2 className="form-heading">Check In Information</h2>
      <div className="form-grid">
        <div>
          <label className="form-label">Check In</label>
          <input
            type="date"
            className="form-input"
            name="checkIn"
            value={formData.checkIn}
            onChange={handleChange}
            style={{ color: getTextColor(formData.checkIn) }}
            required
          />
        </div>
        <div>
          <label className="form-label">Check Out</label>
          <input
            type="date"
            className="form-input"
            name="checkOut"
            value={formData.checkOut}
            onChange={handleChange}
            style={{ color: getTextColor(formData.checkOut) }}
            required
          />
        </div>
        <div>
          <label className="form-label">Duration of Stay *</label>
          <input
            type="number"
            className="form-input"
            name="duration"
            value={formData.duration}
            placeholder="Enter Number of Days/Night"
            disabled
            style={{ color: getTextColor(formData.duration) }}
          />
        </div>
        <div>
          <label className="form-label">Adults</label>
          <input
            type="number"
            className="form-input"
            name="adults"
            value={formData.adults}
            onChange={handleChange}
            min="1"
            style={{ color: getTextColor(formData.adults) }}
          />
        </div>
        <div>
          <label className="form-label">Kids</label>
          <input
            type="number"
            className="form-input"
            name="kids"
            value={formData.kids}
            onChange={handleChange}
            min="0"
            style={{ color: getTextColor(formData.kids) }}
          />
        </div>
      </div>
      <div className="text-right">
        <button type="submit" className="submit-button">Next</button>
      </div>
    </form>
  );
};

export default CheckInForm;