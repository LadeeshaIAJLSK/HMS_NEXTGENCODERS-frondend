import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ReservationForm.css";

const ReservationForm = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [roomTypeFilter, setRoomTypeFilter] = useState("all");
  const [roomClassFilter, setRoomClassFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [uniqueTypes, setUniqueTypes] = useState([]);
  const [uniqueClasses, setUniqueClasses] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/posts/rooms")
      .then(res => {
        const vacantRooms = res.data.rooms.filter(r => r.RStatus === "Vacant");
        setRooms(vacantRooms);

        const types = [...new Set(vacantRooms.map(room => room.RType))];
        const classes = [...new Set(vacantRooms.map(room => room.RClass))];
        setUniqueTypes(types);
        setUniqueClasses(classes);
      })
      .catch(err => console.error(err));
  }, []);

  const handleRoomSelect = (roomNo) => {
    setSelectedRooms(prev => 
      prev.includes(roomNo) 
        ? prev.filter(r => r !== roomNo) 
        : [...prev, roomNo]
    );
  };

  const filteredRooms = rooms.filter(room => {
    const typeMatch = roomTypeFilter === "all" || 
                      room.RType.toLowerCase().includes(roomTypeFilter.toLowerCase());
    const classMatch = roomClassFilter === "all" || 
                       room.RClass.toLowerCase().includes(roomClassFilter.toLowerCase());
    const searchMatch = searchQuery === "" || 
                        room.RoomNo.toString().includes(searchQuery) || 
                        room.RType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        room.RClass.toLowerCase().includes(searchQuery.toLowerCase());

    return typeMatch && classMatch && searchMatch;
  });

  return (
    <div className="reservation-container">
      <h1 className="reservation-title">Search For Rooms</h1>
      
      <div className="room-section">
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
        
        <form>
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
              {filteredRooms.length > 0 ? (
                filteredRooms.map(room => (
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
                  <td colSpan="5" className="no-rooms">No rooms match your filters</td>
                </tr>
              )}
            </tbody>
          </table>
        </form>
      </div>
    </div>
  );
};

export default ReservationForm;
