import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./Recsidebar.css";

const Ressidebar = () => {


  return (
    <div className="sidebar">
      <h2>NexStay Hotel</h2>
      <div className="profile">
        <a href="#"><span className="icon">👤</span></a>
        <p>Reception</p>
      </div>
      <ul>
        <li>
          <Link to="/newdashboard">📊 Dashboard</Link>
        </li>
        <li>
          <Link to="/page1">📝 Create Reservation</Link>
        </li>
        <li>
          <Link to="/edit-reservation">📦 Manage Reservation</Link>
        </li>
        <li>
          <Link to="/rooms">📂 All Rooms</Link>
        </li>
        <li>
          <Link to="/restaurant/analytics">📈 Analytics</Link>
        </li>
        <li>
          <Link to="/"><span>⏻</span> Logout </Link>
        </li>
      </ul>
    </div>
  );
};

export default Ressidebar;