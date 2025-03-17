import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import Ownsidebar from "../../../../components/owner/ownSidebar/Ownsidebar";


const EditRooms = () => {
    const { id } = useParams(); // Get the room ID from URL
    const navigate = useNavigate(); // To redirect after updating

    const [room, setRoom] = useState({
        RoomNo: "",
        Guest: "",
        Hstatus: "",
        RStatus: "",
        RType: "",
        RClass: "",
        Price: "",
    });

    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        axios
            .get(`http://localhost:8000/api/rooms/${id}`)  // Fixed endpoint with template literal
            .then((res) => {
                if (res.data.success && res.data.room) {
                    setRoom(res.data.room);
                } else {
                    setErrorMessage("Room not found.");
                }
            })
            .catch((error) => {
                console.error("Error fetching room:", error.response || error);
                setErrorMessage("Failed to fetch room details.");
            });
    }, [id]);

    // Handle input change
    const handleInputChange = (e) => {
        setRoom({ ...room, [e.target.name]: e.target.value });
    };

    // Submit updated room details
    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put(
                `http://localhost:8000/api/rooms/${id}`,  // Fixed endpoint with template literal
                room,
                { headers: { "Content-Type": "application/json" } }
            );

            if (response.data.success) {
                alert("Room Updated Successfully!");
                navigate("/rooms/home"); // Redirect to Home
            } else {
                setErrorMessage("Failed to update room.");
            }
        } catch (error) {
            console.error("Error updating room:", error);
            setErrorMessage("Error: Could not update room.");
        }
    };

    return (
        <div className="content">
            <Ownsidebar/>
                <h1 className="h3 mb-3 font-weight-normal">Edit Room Details</h1>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Room-No</label>
                    <input
                        type="number"
                        className="form-control"
                        name="RoomNo"
                        value={room.RoomNo}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <br />

                <div className="form-group">
                    <label>Guest</label>
                    <input
                        type="text"
                        className="form-control"
                        name="Guest"
                        value={room.Guest}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <br />

                <div className="form-group">
                    <label>Housekeeping Status</label>
                    <select
                        name="Hstatus"
                        className="form-control"
                        value={room.Hstatus}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="" disabled hidden>Select Housekeeping Status</option>
                        <option value="Clean">Clean</option>
                        <option value="Dirty">Dirty</option>
                    </select>
                </div>
                <br />

                <div className="form-group">
                    <label>Room Status</label>
                    <select
                        name="RStatus"
                        className="form-control"
                        value={room.RStatus}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="" disabled hidden>Select Room Status</option>
                        <option value="Booked">Booked</option>
                        <option value="Vacant">Vacant</option>
                        <option value="Occupied">Occupied</option>
                        <option value="Out of Service">Out of Service</option>
                    </select>
                </div>
                <br />

                <div className="form-group">
                    <label>Room Type</label>
                    <select
                        name="RType"
                        className="form-control"
                        value={room.RType}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="" disabled hidden>Select Room Type</option>
                        <option value="Single">Single</option>
                        <option value="Double">Double</option>
                    </select>
                </div>
                <br />

                <div className="form-group">
                    <label>Room Class</label>
                    <select
                        name="RClass"
                        className="form-control"
                        value={room.RClass}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="" disabled hidden>Select Room Class</option>
                        <option value="Standard">Standard</option>
                        <option value="Deluxe">Deluxe</option>
                    </select>
                </div>
                <br />

                <div className="form-group">
                    <label>Price</label>
                    <input
                        type="number"
                        className="form-control"
                        name="Price"
                        value={room.Price}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <br />

                {errorMessage && <p className="text-danger">{errorMessage}</p>}
                <button className="btn btn-success" type="submit">
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default EditRooms;