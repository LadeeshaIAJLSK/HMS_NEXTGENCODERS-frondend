import React, { Component } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import Ownsidebar from "../../../../components/owner/ownSidebar/Ownsidebar";

export default class CreateRooms extends Component {
    constructor(props) {
        super(props);
        this.state = {
            RoomNo: "",
            RStatus: "",
            RType: "",
            RClass: "",
            Price: "",
            redirect: false,
            errorMessage: ""
        };
    }

    handleInputChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    onSubmit = async (e) => {
        e.preventDefault();

        if (!this.state.RoomNo) {
            this.setState({ errorMessage: "Room-No cannot be empty!" });
            return;
        }

        try {
            const response = await axios.post("http://localhost:8000/api/posts/save", this.state);
            if (response.data.success) {
                alert("Room Added Successfully!");
                this.setState({ redirect: true });
            }
        } catch (error) {
            this.setState({ errorMessage: error.response?.data?.message || "Error saving room." });
        }
    };

    render() {
        if (this.state.redirect) {
            return <Navigate to="/rooms/home" />;
        }
        return (
            <div className="content">
                <Ownsidebar/>
                <h1 className="h3 mb-3 font-weight-normal">Add a New Room</h1>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Room-No</label>&nbsp;&nbsp;
                        <input
                            type="number"
                            className="form-control"
                            name="RoomNo"
                            value={this.state.RoomNo}
                            onChange={this.handleInputChange}
                            required
                        />
                    </div>
                    <br />
                    <div className="form-group">
                        <label>Room Status</label>&nbsp;&nbsp;
                        <select
                            name="RStatus"
                            className="form-control"
                            value={this.state.RStatus}
                            onChange={this.handleInputChange}
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
                        <label>Room Type</label>&nbsp;&nbsp;
                        <select
                            name="RType"
                            className="form-control"
                            value={this.state.RType}
                            onChange={this.handleInputChange}
                            required
                        >
                            <option value="" disabled hidden>Select Room Type</option>
                            <option value="Single">Single</option>
                            <option value="Double">Double</option>
                        </select>
                    </div>
                    <br />
                    <div className="form-group">
                        <label>Room Class</label>&nbsp;&nbsp;
                        <select
                            name="RClass"
                            className="form-control"
                            value={this.state.RClass}
                            onChange={this.handleInputChange}
                            required
                        >
                            <option value="" disabled hidden>Select Room Class</option>
                            <option value="Standard">Standard</option>
                            <option value="Deluxe">Deluxe</option>
                        </select>
                    </div>
                    <br />
                    <div className="form-group">
                        <label>Price</label>&nbsp;&nbsp;
                        <input
                            type="number"
                            className="form-control"
                            name="Price"
                            value={this.state.Price}
                            onChange={this.handleInputChange}
                            required
                        />
                    </div>
                    <br />
                    {this.state.errorMessage && <p className="text-danger">{this.state.errorMessage}</p>}
                    <button className="btn btn-success">Save</button>
                </form>
            </div>
        );
    }
} 