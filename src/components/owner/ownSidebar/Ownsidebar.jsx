import { NavLink } from "react-router-dom";
import "./OwnsideBar.css";
import { useState } from "react";

const Sidebar = () => {
  const [isReportsOpen, setIsReportsOpen] = useState(false);

  const toggleReportsMenu = () => {
    setIsReportsOpen(!isReportsOpen);
  };

  return (
    <div className="Ownsidebar">
      <h2>NexStay <br />Hotel</h2><br />

      <div className="Ownsidebar-profile">
        <a href="#"><span className="Ownsidebar-icon">👨🏻‍💼</span></a>&nbsp;Owner
      </div><br />

      <ul className="Ownsidebar-nav">
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
            📊 &nbsp;Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink to="/rooms/home" className={({ isActive }) => (isActive ? "active" : "")}>
            🏠 &nbsp;Rooms
          </NavLink>
        </li>

        <li>
          <button className="Ownsidebar-report-toggle" onClick={toggleReportsMenu}>
            📑 &nbsp;Reports
            <span>{isReportsOpen ? "▲" : "▼"}</span>
          </button>

          {isReportsOpen && (
            <ul className="Ownsidebar-sub-menu">
              <li>
                <NavLink to="/Transactionreports" className={({ isActive }) => (isActive ? "active" : "")}>
                  🔁&nbsp;Transaction Reports
                </NavLink>
              </li>
              <li>
                <NavLink to="/Stockreports" className={({ isActive }) => (isActive ? "active" : "")}>
                  💰 &nbsp;Stock Reports
                </NavLink>
              </li>
              <li>
                <NavLink to="/Checkout" className={({ isActive }) => (isActive ? "active" : "")}>
                  ↪️ &nbsp;Checkout Details
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        <li>
          <NavLink to="/settings" className={({ isActive }) => (isActive ? "active" : "")}>
            ⚙️ &nbsp;Settings
          </NavLink>
        </li>
        <li>
          <NavLink to="/">⏻ &nbsp;Logout </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

