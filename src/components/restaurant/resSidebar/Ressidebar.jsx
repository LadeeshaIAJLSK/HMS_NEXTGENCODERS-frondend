import React from "react";
import { Link } from "react-router";
import "./Navbar.css"; 

const Navbar = () => {
  return (
    <div className="sidebar">
      <h2>NexStay Hotel</h2>
      <div className="profile">
        <a href="#"><span className="icon">👤</span></a>
        <p>Restaurant</p>
      </div>
      <ul>
        <li>
          <Link to="/dashboard">📊 Dashboard</Link>
        </li>
        <li>
          <Link to="/create-order">📝 Create Order</Link>
        </li>
        <li>
          <Link to="/products">📦 Products</Link>
        </li>
        <li>
          <Link to="/category">📂 Category</Link>
        </li>
        <li>
          <Link to="/analytics">📈 Analytics</Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
