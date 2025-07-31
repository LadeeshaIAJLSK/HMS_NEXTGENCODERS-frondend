import React from "react";
import { Link } from "react-router-dom";
import "./Ressidebar.css"; 

const Ressidebar = () => {
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
          <Link to="/restaurant/products">📦 Products</Link>
        </li>
        <li>
          <Link to="/restaurant/categories">📂 Category</Link>
        </li>
        <li>
          <Link to="/analytics">📈 Analytics</Link>
        </li>
      </ul>
    </div>
  );
};

export default Ressidebar;
