import React, { useState, useEffect } from "react";
import axios from "axios";
import CheckInForm from "./CheckInForm";
import GuestInformationForm from "./GuestInformationForm";
import IdCardForm from "./IdCardForm";
import OtherPersonsForm from "./OtherPersonsForm";
import RoomSelectionForm from "./RoomSelectionForm";

const EditReservationForm = ({
  selectedReservation,
  formData,
  setFormData,
  persons,
  setPersons,
  selectedRooms,
  setSelectedRooms,
  selectedCountry,
  setSelectedCountry,
  selectedFiles,
  setSelectedFiles,
  existingFiles,
  onDeleteReservation,
  onSuccess,
  onError,
  onReservationUpdate
}) => {
  const [emailError, setEmailError] = useState(false);
  const [inputColor, setInputColor] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update duration when check-in or check-out dates change
  useEffect(() => {
    const { checkIn, checkOut } = formData;
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      setFormData((prev) => ({ ...prev, duration: diff > 0 ? diff : "" }));
    }
  }, [formData.checkIn, formData.checkOut, setFormData]);

  // Update mobile number when country changes
  useEffect(() => {
    if (selectedCountry && formData.mobile) {
      const currentMobile = formData.mobile.split(' ');
      const phoneNumber = currentMobile.length > 1 ? currentMobile.slice(1).join(' ') : currentMobile[0];
      
      setFormData((prev) => ({
        ...prev,
        mobile: selectedCountry.value + " " + phoneNumber,
      }));
    }
  }, [selectedCountry]);

  const handleFormChange = (e) => {
    const { id, name, value } = e.target;
    const key = id || name;

    setFormData((prev) => ({ ...prev, [key]: value }));
    setInputColor((prev) => ({ ...prev, [key]: "black" }));

    if (key === "email") {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      setEmailError(!emailPattern.test(value));
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedReservation) {
      onError("No reservation selected for editing");
      return;
    }

    if (isSubmitting) {
      return; // Prevent double submission
    }

    // Validate required fields
    if (!formData.firstName || !formData.mobile || !formData.checkIn || !formData.checkOut) {
      onError("Please fill in all required fields");
      return;
    }

    // Validate email if provided
    if (formData.email && emailError) {
      onError("Please enter a valid email address");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare the update data - ensure all fields are properly formatted
      const updateData = {
        firstName: formData.firstName.trim(),
        middleName: formData.middleName ? formData.middleName.trim() : "",
        surname: formData.surname ? formData.surname.trim() : "",
        mobile: formData.mobile.trim(),
        email: formData.email ? formData.email.trim() : "",
        dob: formData.dob || "",
        address: formData.address ? formData.address.trim() : "",
        city: formData.city ? formData.city.trim() : "",
        gender: formData.gender || "",
        idType: formData.idType || "",
        idNumber: formData.idNumber ? formData.idNumber.trim() : "",
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        duration: parseInt(formData.duration) || 1,
        adults: parseInt(formData.adults) || 1,
        kids: parseInt(formData.kids) || 0,
        otherPersons: persons.filter(person => person.name.trim() !== ""), // Filter out empty persons
        selectedRooms: selectedRooms || []
      };

      // Add country information if available
      if (selectedCountry) {
        updateData.country = selectedCountry.label;
        updateData.countryCode = selectedCountry.value;
      }

      console.log('Sending update data:', updateData);
      console.log('Reservation ID:', selectedReservation._id);

      // Make the API call
      const response = await axios.put(
        `http://localhost:8000/api/reservations/${selectedReservation._id}`,
        updateData,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 second timeout
        }
      );
      
      console.log('Update response:', response.data);
      
      onSuccess("Reservation updated successfully!");
      
      // Call the callback with the updated reservation
      if (onReservationUpdate && response.data) {
        const updatedReservation = response.data.updatedReservation || response.data;
        onReservationUpdate(updatedReservation);
      }
      
    } catch (error) {
      console.error("Error updating reservation:", error);
      
      // More detailed error handling
      if (error.response) {
        console.error("Error response:", error.response.data);
        const errorMessage = error.response.data.msg || 
                           error.response.data.message || 
                           error.response.data.error ||
                           `Server error: ${error.response.status}`;
        onError(`Error updating reservation: ${errorMessage}`);
      } else if (error.request) {
        console.error("Network error:", error.request);
        onError("Network error. Please check your connection and try again.");
      } else if (error.code === 'ECONNABORTED') {
        onError("Request timeout. Please try again.");
      } else {
        console.error("Unknown error:", error.message);
        onError("Error updating reservation. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTextColor = (value) => (value ? "#000000" : "#718096");

  return (
    <form className="checkinform-form-container" onSubmit={handleSubmit}>
      <CheckInForm 
        formData={formData}
        handleFormChange={handleFormChange}
        getTextColor={getTextColor}
      />

      <GuestInformationForm
        formData={formData}
        handleFormChange={handleFormChange}
        inputColor={inputColor}
        emailError={emailError}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
      />

      <IdCardForm
        formData={formData}
        handleFormChange={handleFormChange}
        selectedFiles={selectedFiles}
        handleFileChange={handleFileChange}
        existingFiles={existingFiles}
      />

      <OtherPersonsForm
        persons={persons}
        setPersons={setPersons}
        getTextColor={getTextColor}
      />

      <RoomSelectionForm
        selectedReservation={selectedReservation}
        selectedRooms={selectedRooms}
        setSelectedRooms={setSelectedRooms}
      />

      <div className="form-actions">
        <button 
          type="button" 
          className="delete-button" 
          onClick={onDeleteReservation}
          disabled={isSubmitting}
        >
          Delete Reservation
        </button>
        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update Reservation"}
        </button>
      </div>
    </form>
  );
};

export default EditReservationForm;