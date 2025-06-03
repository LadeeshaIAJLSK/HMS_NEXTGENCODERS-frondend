import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import GuestForm from "./GuestForm";
import IDCardForm from "./IDCardForm";
import OtherPersonsTable from "./OtherPersonsTable";
import RoomSelectionSection from "./RoomSelectionSection";

const EditReservationForm = ({ 
  selectedReservation, 
  countries, 
  onDeleteSuccess,
  onUpdateSuccess,
  setError,
  setSuccess
}) => {
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    duration: "",
    adults: "1",
    kids: "0",
    firstName: "",
    mobile: "",
    email: "",
    middleName: "",
    surname: "",
    dob: "",
    address: "",
    city: "",
    gender: "",
    idType: "",
    idNumber: "",
  });

  const [persons, setPersons] = useState([
    { name: '', gender: '', age: '', address: '', idType: '', idNo: '' }
  ]);

  const [rooms, setRooms] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [roomTypeFilter, setRoomTypeFilter] = useState("all");
  const [roomClassFilter, setRoomClassFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [uniqueTypes, setUniqueTypes] = useState([]);
  const [uniqueClasses, setUniqueClasses] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [emailError, setEmailError] = useState(false);
  const [inputColor, setInputColor] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);

  const getTextColor = (value) => value ? "black" : "#718096";

  useEffect(() => {
    if (selectedReservation) {
      setFormData({
        checkIn: selectedReservation.checkIn.split('T')[0],
        checkOut: selectedReservation.checkOut.split('T')[0],
        duration: selectedReservation.duration,
        adults: selectedReservation.adults,
        kids: selectedReservation.kids,
        firstName: selectedReservation.firstName,
        mobile: selectedReservation.mobile,
        email: selectedReservation.email,
        middleName: selectedReservation.middleName || "",
        surname: selectedReservation.surname || "",
        dob: selectedReservation.dob ? selectedReservation.dob.split('T')[0] : "",
        address: selectedReservation.address,
        city: selectedReservation.city || "",
        gender: selectedReservation.gender || "",
        idType: selectedReservation.idType || "",
        idNumber: selectedReservation.idNumber || "",
      });

      if (selectedReservation.otherPersons && selectedReservation.otherPersons.length > 0) {
        setPersons(selectedReservation.otherPersons);
      } else {
        setPersons([{ name: '', gender: '', age: '', address: '', idType: '', idNo: '' }]);
      }

      setSelectedRooms(selectedReservation.selectedRooms || []);

      if (selectedReservation.countryCode) {
        const country = countries.find(c => c.value === selectedReservation.countryCode);
        if (country) setSelectedCountry(country);
      }

      setExistingFiles(selectedReservation.idFiles || []);
    }
  }, [selectedReservation, countries]);

  useEffect(() => {
    if (selectedCountry) {
      setFormData((prev) => ({
        ...prev,
        mobile: selectedCountry.value + " " + (prev.mobile.split(' ')[1] || ""),
      }));
    }
  }, [selectedCountry]);

  useEffect(() => {
    const { checkIn, checkOut } = formData;
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      setFormData((prev) => ({ ...prev, duration: diff > 0 ? diff : "" }));
    }
  }, [formData.checkIn, formData.checkOut]);

  useEffect(() => {
    if (selectedReservation) {
      axios.get("http://localhost:8000/api/posts/rooms")
        .then(res => {
          const vacantRooms = res.data.rooms.filter(r => r.RStatus === "Vacant" || selectedRooms.includes(r.RoomNo));
          setRooms(vacantRooms);

          const types = [...new Set(vacantRooms.map(room => room.RType))];
          const classes = [...new Set(vacantRooms.map(room => room.RClass))];
          setUniqueTypes(types);
          setUniqueClasses(classes);
        })
        .catch(err => console.error(err));
    }
  }, [selectedReservation, selectedRooms]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

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

  const handleAddPerson = () => {
    setPersons([...persons, { name: '', gender: '', age: '', address: '', idType: '', idNo: '' }]);
  };

  const handleRemovePerson = (index) => {
    if (persons.length > 1) {
      const updatedPersons = [...persons];
      updatedPersons.splice(index, 1);
      setPersons(updatedPersons);
    }
  };

  const handlePersonChange = (index, field, value) => {
    const updatedPersons = [...persons];
    updatedPersons[index][field] = value;
    setPersons(updatedPersons);
  };

  const handleRoomSelect = (roomNo) => {
    setSelectedRooms(prev => 
      prev.includes(roomNo) 
        ? prev.filter(r => r !== roomNo) 
        : [...prev, roomNo]
    );
  };

  const handleDeleteReservation = async () => {
    if (!selectedReservation || !window.confirm("Are you sure you want to delete this reservation?")) {
      return;
    }
    
    try {
      await axios.delete(`http://localhost:8000/api/reservations/${selectedReservation._id}`);
      onDeleteSuccess();
      setError("");
    } catch (error) {
      console.error("Error deleting reservation:", error);
      setError("Error deleting reservation. Please try again.");
      setSuccess("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedReservation) {
      setError("No reservation selected for editing");
      return;
    }
    
    try {
      const formDataToSend = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      
      formDataToSend.append('otherPersons', JSON.stringify(persons));
      formDataToSend.append('selectedRooms', JSON.stringify(selectedRooms));
      
      selectedFiles.forEach((file) => {
        formDataToSend.append('idFiles', file);
      });
      
      existingFiles.forEach(file => {
        formDataToSend.append('existingFiles', file);
      });
      
      if (selectedCountry) {
        formDataToSend.append('country', selectedCountry.label);
        formDataToSend.append('countryCode', selectedCountry.value);
      }

      const response = await axios.put(
        `http://localhost:8000/api/reservations/${selectedReservation._id}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      setSuccess("Reservation updated successfully!");
      setError("");
      onUpdateSuccess(response.data.updatedReservation);
      
    } catch (error) {
      console.error("Error updating reservation:", error);
      setError("Error updating reservation. Please try again.");
      setSuccess("");
    }
  };

  return (
    <form className="checkinform-form-container" onSubmit={handleSubmit}>
      <GuestForm 
        formData={formData}
        handleFormChange={handleFormChange}
        getTextColor={getTextColor}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        countries={countries}
        emailError={emailError}
        inputColor={inputColor}
      />
      
      <IDCardForm
        formData={formData}
        handleFormChange={handleFormChange}
        handleFileChange={handleFileChange}
        existingFiles={existingFiles}
      />
      
      <OtherPersonsTable
        persons={persons}
        handlePersonChange={handlePersonChange}
        handleAddPerson={handleAddPerson}
        handleRemovePerson={handleRemovePerson}
        getTextColor={getTextColor}
      />
      
      <RoomSelectionSection
        rooms={rooms}
        selectedRooms={selectedRooms}
        handleRoomSelect={handleRoomSelect}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        roomTypeFilter={roomTypeFilter}
        setRoomTypeFilter={setRoomTypeFilter}
        roomClassFilter={roomClassFilter}
        setRoomClassFilter={setRoomClassFilter}
        uniqueTypes={uniqueTypes}
        uniqueClasses={uniqueClasses}
      />

      <div className="form-actions">
        <button type="button" className="delete-button" onClick={handleDeleteReservation}>
          Delete Reservation
        </button>
        <button type="submit" className="submit-button">
          Update Reservation
        </button>
      </div>
    </form>
  );
};

export default EditReservationForm;