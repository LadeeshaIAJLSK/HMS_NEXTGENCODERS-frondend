import React, { useState, useEffect } from "react";
import Select from "react-select";
import "./Reservation1.css";

const countries = [
    { label: "Afghanistan", value: "+93" },
    { label: "Albania", value: "+355" },
    { label: "Algeria", value: "+213" },
    { label: "Andorra", value: "+376" },
    { label: "Angola", value: "+244" },
    { label: "Argentina", value: "+54" },
    { label: "Australia", value: "+61" },
    { label: "Austria", value: "+43" },
    { label: "Bangladesh", value: "+880" },
    { label: "Belgium", value: "+32" },
    { label: "Brazil", value: "+55" },
    { label: "Canada", value: "+1" },
    { label: "China", value: "+86" },
    { label: "Denmark", value: "+45" },
    { label: "Egypt", value: "+20" },
    { label: "France", value: "+33" },
    { label: "Germany", value: "+49" },
    { label: "India", value: "+91" },
    { label: "Indonesia", value: "+62" },
    { label: "Italy", value: "+39" },
    { label: "Japan", value: "+81" },
    { label: "Mexico", value: "+52" },
    { label: "Netherlands", value: "+31" },
    { label: "Nigeria", value: "+234" },
    { label: "Pakistan", value: "+92" },
    { label: "Philippines", value: "+63" },
    { label: "Russia", value: "+7" },
    { label: "Saudi Arabia", value: "+966" },
    { label: "South Africa", value: "+27" },
    { label: "Spain", value: "+34" },
    { label: "Sri Lanka", value: "+94" },
    { label: "Sweden", value: "+46" },
    { label: "Thailand", value: "+66" },
    { label: "United Arab Emirates", value: "+971" },
    { label: "United Kingdom", value: "+44" },
    { label: "United States", value: "+1" },
    { label: "Vietnam", value: "+84" }
];

const Reservation1 = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    mobile: "",
    email: "",
    middleName: "",
    surname: "",
    dob: "",
    address: "",
    city: "",
    gender: "",
  });

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [emailError, setEmailError] = useState(false);
  const [inputColor, setInputColor] = useState({});

  useEffect(() => {
    if (selectedCountry) {
      setFormData((prev) => ({ ...prev, mobile: selectedCountry.value + " " }));
    }
  }, [selectedCountry]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    // Make text color black when typing
    setInputColor((prev) => ({ ...prev, [id]: "black" }));

    // Email validation
    if (id === "email") {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      setEmailError(!emailPattern.test(value));
    }
  };

  return (
    <form className="form-container">
      <h2 className="form-heading">Guest Information</h2>
      <div className="form-grid">
        <div>
          <label className="form-label">First Name *</label>
          <input
            type="text"
            id="firstName"
            className="form-input"
            placeholder="Enter First Name"
            value={formData.firstName}
            onChange={handleChange}
            style={{ color: inputColor.firstName || "#718096" }}
          />

          <label className="form-label">Mobile No. *</label>
          <input
            type="tel"
            id="mobile"
            className="form-input"
            value={formData.mobile}
            onChange={handleChange}
            style={{ color: inputColor.mobile || "#718096" }}
          />

          <label className="form-label">Gender</label>
          <select
            id="gender"
            className="form-input"
            value={formData.gender}
            onChange={handleChange}
            style={{ color: inputColor.gender || "#718096" }}
          >
            <option value="">--Select--</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <label className="form-label">Country *</label>
          <Select
            options={countries}
            onChange={setSelectedCountry}
            placeholder="Select a Country"
            className="form-input"
          />
        </div>

        <div>
          <label className="form-label">Middle Name</label>
          <input
            type="text"
            id="middleName"
            className="form-input"
            placeholder="Enter Middle Name"
            value={formData.middleName}
            onChange={handleChange}
            style={{ color: inputColor.middleName || "#718096" }}
          />

          <label className="form-label">E-mail</label>
          <input
            type="email"
            id="email"
            className="form-input"
            placeholder="Enter E-mail"
            value={formData.email}
            onChange={handleChange}
            style={{ color: inputColor.email || "#718096" }}
          />
          {emailError && <span className="error-message">Invalid email address</span>}

          <label className="form-label">City</label>
          <input
            type="text"
            id="city"
            className="form-input"
            placeholder="Enter City"
            value={formData.city}
            onChange={handleChange}
            style={{ color: inputColor.city || "#718096" }}
          />
        </div>

        <div>
          <label className="form-label">Surname</label>
          <input
            type="text"
            id="surname"
            className="form-input"
            placeholder="Enter Surname"
            value={formData.surname}
            onChange={handleChange}
            style={{ color: inputColor.surname || "#718096" }}
          />

          <label className="form-label">Date of Birth</label>
          <input
            type="date"
            id="dob"
            className="form-input"
            value={formData.dob}
            onChange={handleChange}
            style={{ color: inputColor.dob || "#718096" }}
          />

          <label className="form-label">Address *</label>
          <textarea
            id="address"
            className="form-input"
            placeholder="Enter Address"
            value={formData.address}
            onChange={handleChange}
            style={{ color: inputColor.address || "#718096" }}
          ></textarea>
        </div>
      </div>
    </form>
  );
};

export default Reservation1;
