import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SearchSection from "./SearchSection"
import EditReservationForm from "./EditReservationForm";
import ViewReservationDetails from "./ViewReservationDetails";
import { countries } from "../FormSection1/countries"; // Assuming you have a countries.js file with the countries array

const GuestRes = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [allReservations, setAllReservations] = useState([]);
  const [displayedReservations, setDisplayedReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [roomDetails, setRoomDetails] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);

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

  const [selectedRooms, setSelectedRooms] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);

  // Fetch all reservations on component mount
  useEffect(() => {
    const fetchAllReservations = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:8000/api/reservations");
        setAllReservations(response.data);
        setDisplayedReservations(response.data);
      } catch (err) {
        setError("Error fetching reservations");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAllReservations();
  }, []);

  // Fetch room and payment details when viewing a reservation
  useEffect(() => {
    if (viewMode && selectedReservation) {
      const fetchDetails = async () => {
        try {
          const roomsResponse = await axios.get("http://localhost:8000/api/posts/rooms");
          const bookedRooms = roomsResponse.data.rooms.filter(room => 
            selectedReservation.selectedRooms.includes(room.RoomNo)
          );
          setRoomDetails(bookedRooms);
          
          const paymentsResponse = await axios.get(
            `http://localhost:8000/api/reservations/${selectedReservation._id}/payments`
          );
          setPaymentHistory(paymentsResponse.data);
        } catch (err) {
          console.error("Error fetching details:", err);
        }
      };
      
      fetchDetails();
    }
  }, [viewMode, selectedReservation]);

  // Filter reservations based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setDisplayedReservations(allReservations);
    } else {
      const filtered = allReservations.filter(reservation => {
        const searchLower = searchTerm.toLowerCase();
        return (
          reservation.firstName.toLowerCase().includes(searchLower) ||
          (reservation.surname && reservation.surname.toLowerCase().includes(searchLower)) ||
          reservation.mobile.includes(searchTerm) ||
          (reservation._id && reservation._id.toLowerCase().includes(searchLower)) ||
          (reservation.idNumber && reservation.idNumber.toLowerCase().includes(searchLower))
        );
      });
      setDisplayedReservations(filtered);
      setCurrentPage(1);
    }
  }, [searchTerm, allReservations]);

  const loadReservation = (reservation) => {
    setSelectedReservation(reservation);
    setViewMode(false);
    
    setFormData({
      checkIn: reservation.checkIn.split('T')[0],
      checkOut: reservation.checkOut.split('T')[0],
      duration: reservation.duration,
      adults: reservation.adults,
      kids: reservation.kids,
      firstName: reservation.firstName,
      mobile: reservation.mobile,
      email: reservation.email,
      middleName: reservation.middleName || "",
      surname: reservation.surname || "",
      dob: reservation.dob ? reservation.dob.split('T')[0] : "",
      address: reservation.address,
      city: reservation.city || "",
      gender: reservation.gender || "",
      idType: reservation.idType || "",
      idNumber: reservation.idNumber || "",
    });

    if (reservation.otherPersons && reservation.otherPersons.length > 0) {
      setPersons(reservation.otherPersons);
    } else {
      setPersons([{ name: '', gender: '', age: '', address: '', idType: '', idNo: '' }]);
    }

    setSelectedRooms(reservation.selectedRooms || []);

    if (reservation.countryCode) {
      const country = countries.find(c => c.value === reservation.countryCode);
      if (country) setSelectedCountry(country);
    }

    setExistingFiles(reservation.idFiles || []);
  };

  const viewReservation = (reservation) => {
    setSelectedReservation(reservation);
    setViewMode(true);
    setFormData({
      checkIn: reservation.checkIn.split('T')[0],
      checkOut: reservation.checkOut.split('T')[0],
      duration: reservation.duration,
      adults: reservation.adults,
      kids: reservation.kids,
      firstName: reservation.firstName,
      mobile: reservation.mobile,
      email: reservation.email,
      middleName: reservation.middleName || "",
      surname: reservation.surname || "",
      dob: reservation.dob ? reservation.dob.split('T')[0] : "",
      address: reservation.address,
      city: reservation.city || "",
      gender: reservation.gender || "",
      idType: reservation.idType || "",
      idNumber: reservation.idNumber || "",
    });
  };

  const handleDeleteReservation = async () => {
    if (!selectedReservation || !window.confirm("Are you sure you want to delete this reservation?")) {
      return;
    }
    
    try {
      await axios.delete(`http://localhost:8000/api/reservations/${selectedReservation._id}`);
      setSuccess("Reservation deleted successfully!");
      setError("");
      setSelectedReservation(null);
      
      setAllReservations(allReservations.filter(r => r._id !== selectedReservation._id));
      setDisplayedReservations(displayedReservations.filter(r => r._id !== selectedReservation._id));
      
      // Reset form data
      setFormData({
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
      setPersons([{ name: '', gender: '', age: '', address: '', idType: '', idNo: '' }]);
      setSelectedCountry(null);
      setSelectedFiles([]);
      setSelectedRooms([]);
    } catch (error) {
      console.error("Error deleting reservation:", error);
      setError("Error deleting reservation. Please try again.");
      setSuccess("");
    }
  };

  const refreshReservations = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/reservations");
      setAllReservations(response.data);
      setDisplayedReservations(response.data);
    } catch (err) {
      console.error("Error refreshing reservations:", err);
    }
  };

  return (
    <div className="edit-reservation-container">
      <h1 className="page-title">Edit Reservation</h1>
      
      <SearchSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        entriesPerPage={entriesPerPage}
        setEntriesPerPage={setEntriesPerPage}
        error={error}
        success={success}
        displayedReservations={displayedReservations}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isLoading={isLoading}
        selectedReservation={selectedReservation}
        viewMode={viewMode}
        loadReservation={loadReservation}
        viewReservation={viewReservation}
      />
      
      {selectedReservation && !viewMode && (
        <EditReservationForm
          selectedReservation={selectedReservation}
          formData={formData}
          setFormData={setFormData}
          persons={persons}
          setPersons={setPersons}
          selectedRooms={selectedRooms}
          setSelectedRooms={setSelectedRooms}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          existingFiles={existingFiles}
          onDeleteReservation={handleDeleteReservation}
          onSuccess={(message) => setSuccess(message)}
          onError={(message) => setError(message)}
          onReservationUpdate={(updatedReservation) => {
            setAllReservations(allReservations.map(res => 
              res._id === updatedReservation._id ? updatedReservation : res
            ));
            loadReservation(updatedReservation);
          }}
        />
      )}
      
      {selectedReservation && viewMode && (
        <ViewReservationDetails
          selectedReservation={selectedReservation}
          formData={formData}
          roomDetails={roomDetails}
          paymentHistory={paymentHistory}
          setPaymentHistory={setPaymentHistory}
          onBackToEdit={() => setViewMode(false)}
          onSuccess={(message) => setSuccess(message)}
          onError={(message) => setError(message)}
          onCheckoutComplete={refreshReservations}
        />
      )}
    </div>
  );
};

export default GuestRes;