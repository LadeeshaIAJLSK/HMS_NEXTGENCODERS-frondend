import React from 'react';
import CheckInInfo from './FormSection1/CheckInInfo';
import CustomerTypeSection from './FormSection1/CustomerTypeSection';
import GuestInfo from './FormSection1/GuestInfo';
import IdCardInfo from './FormSection1/IdCardInfo';
import AdditionalPersons from './FormSection1/AdditionalPersons';
import RoomSelection from './FormSection1/RoomSelection';
import PaymentInfo from './FormSection1/PaymentInfo';
import useCheckInForm from './FormSection1/useCheckInForm';
import './checkstyle.css';
import { Form } from 'react-router-dom';

const FormSection = () => {
  const form = useCheckInForm();

  // Calculate duration from check-in and check-out dates
  const calculateDuration = () => {
    const checkIn = new Date(form.formData.checkIn);
    const checkOut = new Date(form.formData.checkOut);
    
    if (!form.formData.checkIn || !form.formData.checkOut) return 1;
    
    const diffTime = Math.abs(checkOut - checkIn);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays); // Ensure minimum 1 night
  };

  return (
    <div className="checkin-form-scope">
      <form onSubmit={form.handleSubmit}>
        <CheckInInfo formData={form.formData} handleFormChange={form.handleFormChange} />
        
        <CustomerTypeSection
          customerType={form.customerType}
          setCustomerType={form.setCustomerType}
          searchTerm={form.searchTerm}
          setSearchTerm={form.setSearchTerm}
          searchResults={form.searchResults}
          showSearchResults={form.showSearchResults}
          handleCustomerSearch={form.handleCustomerSearch}
          handleCustomerSelect={form.handleCustomerSelect}
          formData={form.formData}
        />
        
        <GuestInfo 
          formData={form.formData}
          handleFormChange={form.handleFormChange}
          selectedCountry={form.selectedCountry}
          setSelectedCountry={form.setSelectedCountry}
          emailError={form.emailError}
        />
        
        <IdCardInfo 
          formData={form.formData}
          handleFormChange={form.handleFormChange}
          handleFileChange={form.handleFileChange}
          fileInputRef={form.fileInputRef}
        />
        
        <AdditionalPersons 
          persons={form.persons}
          handleAddPerson={form.handleAddPerson}
          handleRemovePerson={form.handleRemovePerson}
          handlePersonChange={form.handlePersonChange}
        />
        
        <RoomSelection 
          {...form}
          duration={calculateDuration()}
        />
        
        <PaymentInfo 
          formData={form.formData}
          handleFormChange={form.handleFormChange}
          errors={form.errors}
        />
        
        <div className="text-right">
          <button type="submit" className="submit-button">
            Submit Reservation
          </button>
        </div>
      </form>

      {/* ADD THE POPUP HERE - AT THE END OF THE COMPONENT */}
      {form.showPopup && (
        <div className="success-popup-overlay">
          <div className="success-popup-content">
            <div className="success-popup-icon">
              {form.popupType === 'success' ? '✅' : '❌'}
            </div>
            <h3 className="success-popup-title">
              {form.popupType === 'success' ? 'Success!' : 'Error!'}
            </h3>
            <p className="success-popup-message">
              {form.popupMessage}
            </p>
            <button 
              onClick={form.handlePopupOk}
              className="success-popup-button"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormSection;