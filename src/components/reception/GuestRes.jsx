import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReservationList from "../reception/Formedit/ReservationList";
import EditReservationForm from "../reception/Formedit/EditReservationForm";
import ViewReservation from "../reception/Formedit/ViewReservation";
import { countries } from "../reception/FormSection1/countries"

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

  const totalPages = Math.ceil(displayedReservations.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const paginatedReservations = displayedReservations.slice(startIndex, endIndex);

  const loadReservation = (reservation) => {
    setSelectedReservation(reservation);
    setViewMode(false);
    setSuccess("");
    setError("");
  };

  const viewReservation = (reservation) => {
    setSelectedReservation(reservation);
    setViewMode(true);
    setSuccess("");
    setError("");
  };

  const handleDeleteSuccess = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/reservations");
      setAllReservations(response.data);
      setDisplayedReservations(response.data);
      setSelectedReservation(null);
      setSuccess("Reservation deleted successfully!");
    } catch (error) {
      setError("Error refreshing reservations after deletion");
      console.error(error);
    }
  };

  const handleUpdateSuccess = async (e) => {
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
      
      loadReservation(response.data.updatedReservation);
      
      setAllReservations(allReservations.map(res => 
        res._id === response.data.updatedReservation._id ? response.data.updatedReservation : res
      ));
      
    } catch (error) {
      console.error("Error updating reservation:", error);
      setError("Error updating reservation. Please try again.");
      setSuccess("");
    }
  };

  return (
    <div className="edit-reservation-container">
      <h1 className="page-title">Edit Reservation</h1>
      
      <ReservationList 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        entriesPerPage={entriesPerPage}
        setEntriesPerPage={setEntriesPerPage}
        isLoading={isLoading}
        paginatedReservations={paginatedReservations}
        selectedReservation={selectedReservation}
        loadReservation={loadReservation}
        viewReservation={viewReservation}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={endIndex}
        displayedReservations={displayedReservations}
        error={error}
        success={success}
        viewMode={viewMode}
      />
      
      {selectedReservation && !viewMode && (
        <EditReservationForm 
          selectedReservation={selectedReservation}
          countries={countries}
          onDeleteSuccess={handleDeleteSuccess}
          onUpdateSuccess={handleUpdateSuccess}
          setError={setError}
          setSuccess={setSuccess}
        />
      )}
      
      {selectedReservation && viewMode && (
        <ViewReservation 
          selectedReservation={selectedReservation}
          setViewMode={setViewMode}
          setError={setError}
          setSuccess={setSuccess}
        />
      )}
    </div>
  );
};

export default GuestRes;