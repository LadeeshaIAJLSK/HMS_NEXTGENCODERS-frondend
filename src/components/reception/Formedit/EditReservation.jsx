import React, { useState, useEffect } from "react";
import axios from "axios";
import ReservationList from "./ReservationList";
import ReservationForm from "./ReservationForm";
import ReservationView from "./ReservationView";
import PaymentSection from "./PaymentSection";
import RoomSelector from "./RoomSelector";

const EditReservation = () => {
  const [state, setState] = useState({
    searchTerm: "",
    allReservations: [],
    displayedReservations: [],
    selectedReservation: null,
    viewMode: false,
    isLoading: false,
    error: "",
    success: "",
    entriesPerPage: 10,
    currentPage: 1,
    paymentAmount: 0,
    paymentMethod: "Cash",
    paymentNotes: "",
    roomDetails: [],
    paymentHistory: [],
    formData: {
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
    },
    persons: [{ name: '', gender: '', age: '', address: '', idType: '', idNo: '' }],
    rooms: [],
    selectedRooms: [],
    roomTypeFilter: "all",
    roomClassFilter: "all",
    searchQuery: "",
    uniqueTypes: [],
    uniqueClasses: [],
    selectedCountry: null,
    emailError: false,
    inputColor: {},
    selectedFiles: [],
    existingFiles: []
  });

  useEffect(() => {
    fetchReservations();
    fetchRooms();
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await axios.get("/api/reservations");
      setState((prev) => ({
        ...prev,
        allReservations: res.data,
        displayedReservations: res.data
      }));
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await axios.get("/api/rooms");
      const uniqueTypes = [...new Set(res.data.map(room => room.roomType))];
      const uniqueClasses = [...new Set(res.data.map(room => room.roomClass))];

      setState((prev) => ({
        ...prev,
        rooms: res.data,
        uniqueTypes,
        uniqueClasses
      }));
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const loadReservation = (reservation) => {
    setState((prev) => ({
      ...prev,
      selectedReservation: reservation,
      formData: { ...prev.formData, ...reservation.formData },
      persons: reservation.persons || [],
      selectedRooms: reservation.selectedRooms || [],
      roomDetails: reservation.roomDetails || [],
      paymentHistory: reservation.paymentHistory || [],
      viewMode: false
    }));
  };

  const viewReservation = (reservation) => {
    setState((prev) => ({
      ...prev,
      selectedReservation: reservation,
      formData: { ...prev.formData, ...reservation.formData },
      persons: reservation.persons || [],
      selectedRooms: reservation.selectedRooms || [],
      roomDetails: reservation.roomDetails || [],
      paymentHistory: reservation.paymentHistory || [],
      viewMode: true
    }));
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      formData: { ...prev.formData, [name]: value }
    }));
  };

  const handleAddPerson = () => {
    setState((prev) => ({
      ...prev,
      persons: [...prev.persons, { name: '', gender: '', age: '', address: '', idType: '', idNo: '' }]
    }));
  };

  const handleRemovePerson = (index) => {
    setState((prev) => ({
      ...prev,
      persons: prev.persons.filter((_, i) => i !== index)
    }));
  };

  const handlePersonChange = (index, field, value) => {
    const updated = [...state.persons];
    updated[index][field] = value;
    setState((prev) => ({
      ...prev,
      persons: updated
    }));
  };

  const handleFileChange = (files) => {
    setState((prev) => ({
      ...prev,
      selectedFiles: files
    }));
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.put(`/api/reservations/${state.selectedReservation._id}`, {
        ...state.formData,
        persons: state.persons,
        selectedRooms: state.selectedRooms,
        files: state.selectedFiles
      });

      setState((prev) => ({
        ...prev,
        success: "Reservation updated successfully!",
        selectedReservation: null
      }));
      fetchReservations();
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: "Failed to update reservation."
      }));
    }
  };

  const handleRoomSelect = (roomId) => {
    const alreadySelected = state.selectedRooms.includes(roomId);
    const updatedRooms = alreadySelected
      ? state.selectedRooms.filter(id => id !== roomId)
      : [...state.selectedRooms, roomId];

    setState((prev) => ({
      ...prev,
      selectedRooms: updatedRooms
    }));
  };

  const handlePayment = async () => {
    try {
      const payment = {
        amount: state.paymentAmount,
        method: state.paymentMethod,
        notes: state.paymentNotes
      };

      await axios.post(`/api/payments/${state.selectedReservation._id}`, payment);

      setState((prev) => ({
        ...prev,
        success: "Payment recorded successfully!",
        paymentAmount: 0,
        paymentNotes: ""
      }));
      fetchReservations();
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: "Payment failed. Please try again."
      }));
    }
  };

  const handleCheckout = async () => {
    try {
      await axios.post(`/api/checkout/${state.selectedReservation._id}`);
      setState((prev) => ({
        ...prev,
        success: "Checkout successful!",
        selectedReservation: null
      }));
      fetchReservations();
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: "Checkout failed."
      }));
    }
  };

  const calculateTotalDue = () => {
    // Dummy value for now — replace with actual calculation
    return state.paymentHistory.reduce((total, p) => total + p.amount, 0);
  };

  const countries = ["India", "USA", "Nepal", "Bhutan"]; // Replace with actual list if needed

  return (
    <div className="reservation-container">
      {!state.selectedReservation ? (
        <ReservationList
          reservations={state.displayedReservations}
          searchTerm={state.searchTerm}
          onSearchChange={(e) => setState({ ...state, searchTerm: e.target.value })}
          onSelectReservation={loadReservation}
          onViewReservation={viewReservation}
          currentPage={state.currentPage}
          totalPages={Math.ceil(state.displayedReservations.length / state.entriesPerPage)}
          onPageChange={(page) => setState({ ...state, currentPage: page })}
        />
      ) : state.viewMode ? (
        <ReservationView
          reservation={state.selectedReservation}
          formData={state.formData}
          roomDetails={state.roomDetails}
          paymentHistory={state.paymentHistory}
          totalDue={calculateTotalDue()}
          onEdit={() => setState({ ...state, viewMode: false })}
          onCheckout={handleCheckout}
        />
      ) : (
        <>
          <ReservationForm
            formData={state.formData}
            persons={state.persons}
            selectedCountry={state.selectedCountry}
            countries={countries}
            emailError={state.emailError}
            existingFiles={state.existingFiles}
            onFormChange={handleFormChange}
            onCountryChange={(country) => setState({ ...state, selectedCountry: country })}
            onAddPerson={handleAddPerson}
            onRemovePerson={handleRemovePerson}
            onPersonChange={handlePersonChange}
            onFileChange={handleFileChange}
            onSubmit={handleSubmit}
            onCancel={() => setState({ ...state, selectedReservation: null })}
          />

          <RoomSelector
            rooms={state.rooms}
            selectedRooms={state.selectedRooms}
            uniqueTypes={state.uniqueTypes}
            uniqueClasses={state.uniqueClasses}
            searchQuery={state.searchQuery}
            roomTypeFilter={state.roomTypeFilter}
            roomClassFilter={state.roomClassFilter}
            onRoomSelect={handleRoomSelect}
            onSearchChange={(e) => setState({ ...state, searchQuery: e.target.value })}
            onTypeFilterChange={(type) => setState({ ...state, roomTypeFilter: type })}
            onClassFilterChange={(cls) => setState({ ...state, roomClassFilter: cls })}
          />
        </>
      )}

      {state.selectedReservation && (
        <PaymentSection
          amount={state.paymentAmount}
          method={state.paymentMethod}
          notes={state.paymentNotes}
          onAmountChange={(e) => setState({ ...state, paymentAmount: e.target.value })}
          onMethodChange={(e) => setState({ ...state, paymentMethod: e.target.value })}
          onNotesChange={(e) => setState({ ...state, paymentNotes: e.target.value })}
          onSubmit={handlePayment}
          error={state.error}
          success={state.success}
        />
      )}
    </div>
  );
};

export default EditReservation;
