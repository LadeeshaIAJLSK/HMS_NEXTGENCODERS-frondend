import React from "react";
import Select from "react-select";

const ReservationForm = ({
  formData,
  persons,
  selectedCountry,
  countries,
  emailError,
  existingFiles,
  onFormChange,
  onCountryChange,
  onAddPerson,
  onRemovePerson,
  onPersonChange,
  onFileChange,
  onSubmit,
  onCancel
}) => {
  return (
    <div className="reservation-form">
      <form onSubmit={onSubmit}>
        <h2>Guest Information</h2>
        
        <div className="form-row">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={onFormChange}
              required
            />
          </div>
          
          {/* Add all other form fields similarly */}
          
          <div className="form-group">
            <label>Country</label>
            <Select
              options={countries}
              value={selectedCountry}
              onChange={onCountryChange}
            />
          </div>
        </div>

        {/* Additional Persons Section */}
        <div className="persons-section">
          <h3>Additional Persons</h3>
          {persons.map((person, index) => (
            <div key={index} className="person-form">
              {/* Person fields */}
              <button type="button" onClick={() => onRemovePerson(index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={onAddPerson}>
            Add Person
          </button>
        </div>

        {/* File Upload Section */}
        <div className="file-upload">
          <h3>Identification Documents</h3>
          <input type="file" multiple onChange={onFileChange} />
          {/* Display existing files */}
        </div>

        <div className="form-actions">
          <button type="submit">Save Changes</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default ReservationForm;