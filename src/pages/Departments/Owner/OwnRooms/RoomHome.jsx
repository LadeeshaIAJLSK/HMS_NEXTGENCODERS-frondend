import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const RoomHome = () => {
  const [rooms, setRooms] = useState([]); // Default state as an empty array
  const [allRooms, setAllRooms] = useState([]); // State to store original data
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/rooms")
      .then((response) => {
        console.log("Fetched rooms:", response.data);
        if (response.data.success && Array.isArray(response.data.rooms)) {
          setRooms(response.data.rooms);
          setAllRooms(response.data.rooms); // Save original data
        } else {
          throw new Error("Invalid API response structure");
        }
      })
      .catch((err) => {
        console.error("Error fetching rooms:", err);
        setError("Failed to load rooms. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await axios.delete(`http://localhost:8000/api/rooms/${id}`);
        setRooms(rooms.filter((room) => room._id !== id));
        alert("Room deleted successfully.");
      } catch (error) {
        console.error("Error deleting room:", error);
        alert("Failed to delete room. Try again!");
      }
    }
  };

  // Function to filter the rooms list based on the search query
  const filterData = (searchKey) => {
    const result = allRooms.filter((room) =>
      room.RoomNo.toString().toLowerCase().includes(searchKey.toLowerCase()) ||
      room.Hstatus.toLowerCase().includes(searchKey.toLowerCase()) ||
      room.RStatus.toLowerCase().includes(searchKey.toLowerCase()) ||
      room.RType.toLowerCase().includes(searchKey.toLowerCase()) ||
      room.RClass.toLowerCase().includes(searchKey.toLowerCase())
    );
    setRooms(result); // Update state with filtered data
  };

  // Handle search input change
  const handleSearchArea = (e) => {
    const searchKey = e.target.value;
    if (searchKey.trim() === "") {
      setRooms(allRooms); // Restore the original data if search is cleared
    } else {
      filterData(searchKey);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h1 className="mb-0">Rooms List</h1>

        {/* Search Bar */}
        <div className="col-lg-3 mt-2 mb-2">
          <input
            className="form-control"
            type="search"
            placeholder="Search"
            name="searchQuery"
            onChange={handleSearchArea}
          />
        </div>
      </div>
      <br />

      {rooms.length === 0 ? (
        <p>No rooms available.</p>
      ) : (
        <>
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Room-No</th>
                <th>Guest</th>
                <th>Housekeeping Status</th>
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
                  <td>{room.Guest || "No Guest"}</td>
                  <td>{room.Hstatus || "No Status"}</td>
                  <td>{room.RStatus || "No Room Status"}</td>
                  <td>{room.RType || "No Room Type"}</td>
                  <td>{room.RClass || "No Room Class"}</td>
                  <td>{room.Price ? `$${room.Price}` : "No Price"}</td>
                  <td>
                    <Link className="btn btn-warning" to={`/edit/${room._id}`}>
                      <i className="fas fa-edit"></i> Edit
                    </Link>
                    &nbsp;&nbsp;<button className="btn btn-danger" style={{ color: "black", backgroundColor: "red" }}
                      onClick={() => handleDelete(room._id)}>
                      <i className="far fa-trash-alt"></i> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link to="/add" className="btn btn-success">
            Add a New Room
          </Link>
        </>
      )}
    </div>
  );
};

export default RoomHome;