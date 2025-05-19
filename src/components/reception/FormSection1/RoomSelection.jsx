import React from 'react';

const RoomSelection = ({
  rooms,
  selectedRooms,
  roomTypeFilter,
  roomClassFilter,
  searchQuery,
  uniqueTypes,
  uniqueClasses,
  handleRoomSelect,
  setRoomTypeFilter,
  setRoomClassFilter,
  setSearchQuery
}) => {
  return (
    <div className="checkinform-form-container">
      <h2 className="checkinform-form-heading">Search For Rooms</h2>
      
      <div className="filter-controls">
        <div className="filter-group">
          <label>Search:</label>
          <input
            type="text"
            placeholder="Room no, type, or class"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label>Filter by type:</label>
          <select 
            value={roomTypeFilter}
            onChange={(e) => setRoomTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            {uniqueTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>Filter by class:</label>
          <select 
            value={roomClassFilter}
            onChange={(e) => setRoomClassFilter(e.target.value)}
          >
            <option value="all">All Classes</option>
            {uniqueClasses.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="rooms-table-container">
        <table className="rooms-table">
          <thead>
            <tr>
              <th>Select</th>
              <th>Room No.</th>
              <th>Type</th>
              <th>Class</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rooms.length > 0 ? (
              rooms.map(room => (
                <tr key={room._id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRooms.includes(room.RoomNo)}
                      onChange={() => handleRoomSelect(room.RoomNo)}
                    />
                  </td>
                  <td>{room.RoomNo}</td>
                  <td>{room.RType}</td>
                  <td>{room.RClass}</td>
                  <td>{room.RStatus}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-rooms">No rooms available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoomSelection;