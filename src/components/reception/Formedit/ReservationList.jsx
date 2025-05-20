import React from "react";

const ReservationList = ({
  reservations,
  searchTerm,
  onSearchChange,
  onSelectReservation,
  onViewReservation,
  currentPage,
  totalPages,
  onPageChange
}) => {
  return (
    <div className="reservation-list">
      <input
        type="text"
        placeholder="Search reservations..."
        value={searchTerm}
        onChange={onSearchChange}
      />
      
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Mobile</th>
            <th>Check-In</th>
            <th>Check-Out</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map(reservation => (
            <tr key={reservation._id}>
              <td>{`${reservation.firstName} ${reservation.surname}`}</td>
              <td>{reservation.mobile}</td>
              <td>{new Date(reservation.checkIn).toLocaleDateString()}</td>
              <td>{new Date(reservation.checkOut).toLocaleDateString()}</td>
              <td>
                <button onClick={() => onSelectReservation(reservation)}>Edit</button>
                <button onClick={() => onViewReservation(reservation)}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ReservationList;