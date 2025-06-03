import React from "react";

const ReservationsTable = ({
  reservations,
  isLoading,
  selectedReservation,
  viewMode,
  onLoadReservation,
  onViewReservation
}) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Reservation ID</th>
          <th>Guest Name</th>
          <th>Phone</th>
          <th>Check-In</th>
          <th>Check-Out</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr>
            <td colSpan="6" className="loading-message">Loading reservations...</td>
          </tr>
        ) : reservations.length > 0 ? (
          reservations.map((reservation) => (
            <tr 
              key={reservation._id}
              className={selectedReservation?._id === reservation._id ? "selected-row" : ""}
            >
              <td>{reservation._id.substring(18)}</td>
              <td>{reservation.firstName} {reservation.surname}</td>
              <td>{reservation.mobile}</td>
              <td>{new Date(reservation.checkIn).toLocaleDateString()}</td>
              <td>{new Date(reservation.checkOut).toLocaleDateString()}</td>
              <td>
                <div className="action-buttons">
                  <button 
                    onClick={() => onLoadReservation(reservation)}
                    className={selectedReservation?._id === reservation._id && !viewMode ? "active-edit-btn" : ""}
                  >
                    {selectedReservation?._id === reservation._id && !viewMode ? "Editing..." : "Edit"}
                  </button>
                  <button 
                    onClick={() => onViewReservation(reservation)}
                    className={selectedReservation?._id === reservation._id && viewMode ? "active-view-btn" : ""}
                  >
                    View
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="no-results">No reservations found</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default ReservationsTable;