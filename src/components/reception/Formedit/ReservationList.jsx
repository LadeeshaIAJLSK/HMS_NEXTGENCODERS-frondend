import React from "react";

const ReservationList = ({
  searchTerm,
  setSearchTerm,
  entriesPerPage,
  setEntriesPerPage,
  isLoading,
  paginatedReservations,
  selectedReservation,
  loadReservation,
  viewReservation,
  currentPage,
  setCurrentPage,
  totalPages,
  startIndex,
  endIndex,
  displayedReservations,
  error,
  success,
  viewMode
}) => {
  return (
    <div className="search-section">
      <div className="search-box">
        <input
          type="text"
          placeholder="Search by name, ID, or phone number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="entries-selector">
          <label>Show entries:</label>
          <select 
            value={entriesPerPage} 
            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <div className="search-results">
        <h3>Reservations</h3>
        <div className="results-info">
          Showing {startIndex + 1} to {Math.min(endIndex, displayedReservations.length)} of {displayedReservations.length} entries
        </div>
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
            ) : paginatedReservations.length > 0 ? (
              paginatedReservations.map((reservation) => (
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
                        onClick={() => loadReservation(reservation)}
                        className={selectedReservation?._id === reservation._id && !viewMode ? "active-edit-btn" : ""}
                      >
                        {selectedReservation?._id === reservation._id && !viewMode ? "Editing..." : "Edit"}
                      </button>
                      <button 
                        onClick={() => viewReservation(reservation)}
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
        
        {displayedReservations.length > 0 && (
          <div className="pagination-controls">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            
            <span>
              Page {currentPage} of {totalPages}
            </span>
            
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationList;