import React from "react";

const RoomSelector = ({
  rooms,
  selectedRooms,
  uniqueTypes,
  uniqueClasses,
  searchQuery,
  roomTypeFilter,
  roomClassFilter,
  onRoomSelect,
  onSearchChange,
  onTypeFilterChange,
  onClassFilterChange
}) => {
  return (
    <div className="room-selector">
      <h2>Room Selection</h2>
      
      <div className="room-filters">
        <input
          type="text"
          placeholder="Search rooms..."
          value={searchQuery}
          onChange={onSearchChange}
        />
        
        <select value={roomTypeFilter} onChange={(e) => onTypeFilterChange(e.target.value)}>
          <option value="all">All Types</option>
          {uniqueTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        
        <select value={roomClassFilter} onChange={(e) => onClassFilterChange(e.target.value)}>
          <option value="all">All Classes</option>
          {uniqueClasses.map(cls => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>
      </div>
      
      <div className="room-grid">
        {rooms.map(room => (
          <div 
            key={room.RoomNo} 
            className={`room-card ${selectedRooms.includes(room.RoomNo) ? 'selected' : ''}`}
            onClick={() => onRoomSelect(room.RoomNo)}
          >
            <h3>Room {room.RoomNo}</h3>
            <p>Type: {room.RType}</p>
            <p>Class: {room.RClass}</p>
            <p>Price: ${room.RPrice}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomSelector;