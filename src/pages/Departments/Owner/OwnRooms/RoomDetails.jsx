import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const RoomDetails = () => {
  const { id } = useParams(); // Grab the room ID from the URL
  const [room, setRoom] = useState(null); // State to store room data
  const [error, setError] = useState(null); // State for error messages
  const [loading, setLoading] = useState(true); // State for loading state
  const navigate = useNavigate(); // Navigation hook to handle navigation actions

  // Use effect to fetch room details when the component mounts or the id changes
  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/rooms/${id}`) // Corrected API route to fetch room details by ID
      .then((res) => {
        if (res.data.success) {
          setRoom(res.data.room); // Set room data on successful response
        } else {
          setError("Room not found."); // Set error if room not found
        }
      })
      .catch((err) => {
        console.error("Error fetching room details:", err);
        setError(err.response?.status === 404 ? "Room not found." : "Failed to load room details.");
      })
      .finally(() => setLoading(false)); // Set loading to false once data is fetched
  }, [id]);

  // Display loading message while data is being fetched
  if (loading) return <div className="container mt-4">Loading...</div>;

  // If an error occurs, show the error message with a button to go back
  if (error)
    return (
      <div className="container mt-4">
        <h4 className="text-danger">{error}</h4>
        <button onClick={() => navigate("/")} className="btn btn-primary mt-3">
          Go Back
        </button>
      </div>
    );

  // Once data is loaded, display room details in a table format
  return (
    <div className="container mt-4">
    <h4>{room?.RoomNo ? `R${room.RoomNo}` : "No Room-No"}</h4>

      <h4>{room?.Guest || "No Guest"}</h4>
      <hr />
      <table className="table table-bordered">
        <tbody>
          <tr>
            <th>Housekeeping Status:</th>
            <td>{room?.Hstatus || "No Status available"}</td>
          </tr>
          <tr>
            <th>Room Status:</th>
            <td>{room?.RStatus || "No Room Status"}</td>
          </tr>
          <tr>
            <th>Room Type:</th>
            <td>{room?.RType || "No Room Type"}</td>
          </tr>
          <tr>
            <th>Room Class:</th>
            <td>{room?.RClass || "No Room Class"}</td>
          </tr>
          <tr>
            <th>Price:</th>
            <td>{room?.Price ? `$${room.Price}` : "No Price"}</td>
          </tr>
        </tbody>
      </table>
      <button onClick={() => navigate("/")} className="btn btn-secondary mt-3">
        Go Back
      </button>
    </div>
  );
};

export default RoomDetails;
