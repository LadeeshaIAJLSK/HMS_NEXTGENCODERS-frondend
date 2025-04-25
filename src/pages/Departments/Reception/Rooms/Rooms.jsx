import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Rooms.css";
import Sidebar from "../../../../components/reception/recSidebar/Recsidebar";

export default function ReceptionRooms() {
  const [rooms, setRooms] = useState({});
  const [expandedGroups, setExpandedGroups] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingRoom, setEditingRoom] = useState(null);
  const [statusOptions] = useState(['Booked', 'Vacant', 'Occupied', 'Out of Service']);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = () => {
    setLoading(true);
    axios.get("http://localhost:8000/api/posts/rooms")
      .then(res => {
        if (res.data.success) {
          const grouped = {};
          res.data.rooms.forEach(room => {
            const key = `${room.RType} - ${room.RClass}`;
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(room);
          });
          setRooms(grouped);

          const initialExpanded = {};
          Object.keys(grouped).forEach(key => {
            initialExpanded[key] = true;
          });
          setExpandedGroups(initialExpanded);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching rooms:", err);
        setLoading(false);
      });
  };

  const toggleGroup = (group) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'occupied': return 'status-occupied';
      case 'vacant': return 'status-vacant';
      case 'booked': return 'status-booked';
      case 'out of service': return 'status-outofservice';
      default: return 'status-other';
    }
  };

  const handleStatusChange = (roomId, newStatus) => {
    axios.put(`http://localhost:8000/api/posts/rooms/${roomId}/status`, { status: newStatus })
      .then(res => {
        if (res.data.success) {
          fetchRooms();
        }
      })
      .catch(err => {
        console.error("Error updating room status:", err);
      });
  };

  const startEditing = (room) => {
    setEditingRoom(room);
  };

  const cancelEditing = () => {
    setEditingRoom(null);
  };

  const saveStatus = (roomId, newStatus) => {
    handleStatusChange(roomId, newStatus);
    setEditingRoom(null);
  };

  if (loading) return <div className="loading-spinner">Loading rooms...</div>;
  if (Object.keys(rooms).length === 0) return <div className="no-rooms">No rooms available</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '20% 80%' }}>
      {/* Sidebar */}
      <div>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="rooms-container">
        <h2 className="rooms-header">🏨 Hotel Room Inventory</h2>

        {Object.keys(rooms).map((group, i) => (
          <div key={i} className="room-category">
            <div className="category-header" onClick={() => toggleGroup(group)}>
              <h3>
                {group}
                <span className="room-count">({rooms[group].length} rooms)</span>
              </h3>
              <span className="toggle-icon">
                {expandedGroups[group] ? '▼' : '▶'}
              </span>
            </div>

            {expandedGroups[group] && (
              <div className="room-table-container">
                <table className="room-table">
                  <thead>
                    <tr>
                      <th>Room No</th>
                      <th>Type</th>
                      <th>Guest</th>
                      <th>Status</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms[group].map(room => (
                      <tr key={room._id} className="room-row">
                        <td className="room-number">{room.RoomNo}</td>
                        <td className="room-type">{room.RType}</td>
                        <td className="room-guest">
                          {room.Guest || <span className="empty-guest">Vacant</span>}
                        </td>
                        <td>
                          {editingRoom?._id === room._id ? (
                            <select
                              className="status-select"
                              defaultValue={room.RStatus}
                              onChange={(e) => saveStatus(room._id, e.target.value)}
                            >
                              {statusOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          ) : (
                            <span
                              className={`status-badge ${getStatusColor(room.RStatus)}`}
                              onClick={() => startEditing(room)}
                            >
                              {room.RStatus}
                            </span>
                          )}
                        </td>
                        <td className="room-price">${room.Price.toLocaleString()}</td>
                        <td className="room-actions">
                          {editingRoom?._id === room._id ? (
                            <button className="action-btn cancel-btn" onClick={cancelEditing}>
                              Cancel
                            </button>
                          ) : (
                            <>
                              <button className="action-btn view-btn">View</button>
                              <button className="action-btn edit-btn" onClick={() => startEditing(room)}>
                                Edit
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
