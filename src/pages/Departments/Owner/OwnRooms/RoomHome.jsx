// Updated RoomHome.jsx to use a custom popup message box instead of alert()
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import Ownsidebar from "../../../../components/owner/ownSidebar/Ownsidebar";
import styles from "./RoomHome.module.css";

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [allRooms, setAllRooms] = useState([]);
  const [roomNoError, setRoomNoError] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const [formRoom, setFormRoom] = useState({
    RoomNo: "",
    RStatus: "",
    RType: "",
    RClass: "",
    Price: "",
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = () => {
    axios
      .get("http://localhost:5004/api/rooms")
      .then((res) => {
        if (res.data.success) {
          setRooms(res.data.rooms);
          setAllRooms(res.data.rooms);
        }
      })
      .catch((err) => {
        console.error("Error fetching rooms:", err);
        setError("Failed to load rooms.");
      })
      .finally(() => setLoading(false));
  };

  const showSuccessPopup = (message) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await axios.delete(`http://localhost:5004/api/rooms/${id}`);
        setRooms((prev) => prev.filter((room) => room._id !== id));
        setAllRooms((prev) => prev.filter((room) => room._id !== id));
        showSuccessPopup("Room deleted successfully!");
      } catch (error) {
        showSuccessPopup("Failed to delete room.");
      }
    }
  };

  const handleSearchArea = (e) => {
    const searchKey = e.target.value.toLowerCase();
    if (searchKey.trim() === "") {
      setRooms(allRooms);
    } else {
      const result = allRooms.filter((room) =>
        ["RoomNo", "RStatus", "RType", "RClass"].some((key) =>
          (room[key] || "").toString().toLowerCase().includes(searchKey)
        )
      );
      setRooms(result);
    }
  };

  const openAddModal = () => {
    setFormRoom({ RoomNo: "", RStatus: "", RType: "", RClass: "", Price: "" });
    setEditMode(false);
    setShowModal(true);
  };

  const openEditModal = (room) => {
    setFormRoom(room);
    setEditingRoomId(room._id);
    setEditMode(true);
    setShowModal(true);
  };

  const handleFormChange = (e) => {
  setFormRoom({ ...formRoom, [e.target.name]: e.target.value });

  if (e.target.name === "RoomNo") {
    setRoomNoError(""); // clear error when changing RoomNo
  }
};
const handleSubmit = async (e) => {
  e.preventDefault();

  // Check for duplicate RoomNo (excluding current room if editing)
  const isDuplicate = allRooms.some(
    (room) =>
      room.RoomNo.toString() === formRoom.RoomNo.toString() &&
      (!editMode || room._id !== editingRoomId)
  );

  if (isDuplicate) {
    setRoomNoError("This Room-No already exists.");
    return;
  } else {
    setRoomNoError(""); // clear if no error
  }

  try {
    if (editMode) {
      await axios.put(`http://localhost:5004/api/rooms/${editingRoomId}`, formRoom);
      showSuccessPopup("Room updated successfully!");
    } else {
      await axios.post("http://localhost:5004/api/rooms", formRoom);
      showSuccessPopup("Room added successfully!");
    }
    setShowModal(false);
    fetchRooms();
  } catch (err) {
    showSuccessPopup("Failed to save room.");
  }
};


  const closeModal = () => {
    setShowModal(false);
    setFormRoom({ RoomNo: "", RStatus: "", RType: "", RClass: "", Price: "" });
  };

  if (loading) return <div className={styles["roomhome-loading"]}>Loading...</div>;
  if (error) return <div className={styles["roomhome-error"]}>{error}</div>;

  return (<div className={styles["roomhome-container"]}>
  <Ownsidebar />

  {/* Only main content gets blurred during popup or modal */}
  <div className={`${styles["roomhome-content"]} ${(showModal || showPopup) ? styles["roomhome-blur"] : ""}`}>

        <div className={styles["roomhome-header"]}>
          <h1>Rooms List</h1>
          <input
            className={styles["roomhome-search-input"]}
            type="search"
            placeholder="Search"
            onChange={handleSearchArea}
          />
        </div>

        {rooms.length === 0 ? (
          <p>No rooms available.</p>
        ) : (
          <>
            <table className={styles["roomhome-table"]}>
              <thead>
                <tr>
                  <th>Room-No</th>
                  <th>Room Status</th>
                  <th>Room Type</th>
                  <th>Room Class</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room._id}>
                    <td>{room.RoomNo ? `R${room.RoomNo}` : "No Room-No"}</td>
                    <td>{room.RStatus || "No Status"}</td>
                    <td>{room.RType || "No Type"}</td>
                    <td>{room.RClass || "No Class"}</td>
                    <td>{room.Price ? `$${room.Price}` : "No Price"}</td>
                    <td>
                      <button className={styles["roomhome-icon-btn"]} onClick={() => openEditModal(room)}>
                        <FaEdit className={styles["edit-icon"]} />
                      </button>
                      <button className={styles["roomhome-icon-btn"]} onClick={() => handleDelete(room._id)}>
                        <FaTrashAlt className={styles["delete-icon"]} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className={styles["roomhome-add-btn"]} onClick={openAddModal}>
              <FaPlus /> Add a New Room
            </button>
          </>
        )}
      </div>

      {showModal && (
        <div className={styles["roomhome-modal-overlay"]}>
          <div className={styles["roomhome-modal-content"]}>
            <h2>{editMode ? "Edit Room Details" : "Add a New Room"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
  <label>Room-No</label>
  <input
    name="RoomNo"
    type="number"
    required
    value={formRoom.RoomNo}
    onChange={handleFormChange}
    style={roomNoError ? { borderColor: "red" } : {}}
  />
  {roomNoError && <small style={{ color: "red" }}>{roomNoError}</small>}
</div>

              <div className="form-group">
                <label>Room Status</label>
                <select name="RStatus" required value={formRoom.RStatus} onChange={handleFormChange}>
                  <option value="">Select Room Status</option>
                  <option value="Vacant">Vacant</option>
                  <option value="Booked">Booked</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Out of Service">Out of Service</option>
                </select>
              </div>
              <div className="form-group">
                <label>Room Type</label>
                <select name="RType" required value={formRoom.RType} onChange={handleFormChange}>
                  <option value="">Select Room Type</option>
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                </select>
              </div>
              <div className="form-group">
                <label>Room Class</label>
                <select name="RClass" required value={formRoom.RClass} onChange={handleFormChange}>
                  <option value="">Select Room Class</option>
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe</option>
                </select>
              </div>
              <div className="form-group">
                <label>Price</label>
                <input name="Price" type="number" required value={formRoom.Price} onChange={handleFormChange} />
              </div>
              <table border="none">
                <tr>
                  <td>
                    <button type="button" className={styles["cancel-btn"]} onClick={closeModal}>Cancel</button>
                  </td>
                  <td>
                    <button type="submit" className={styles["save-btn"]}>Save</button>
                  </td>
                </tr>
              </table>
            </form>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showPopup && (
        <div className={styles["popup-success"]}>
          <div className={styles["popup-box"]}>
            <span className={styles["popup-icon"]}>✅</span>
            <h3>Success!</h3>
            <p>{popupMessage}</p>
            <button className={styles["popup-ok"]} onClick={() => setShowPopup(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;