import { NavLink } from "react-router-dom";
import "./Ownsidebar.css"; // Import layout CSS

const Ownsidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="head-title">NexStay Hotel</h2><br/>
      <p className="sidebar-title"> 
        <i className="fas fa-user-circle owner-icon"></i> &nbsp;Owner
      </p>
      <ul className="sidebar-nav"><hr/>
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
            <i className="fas fa-tachometer-alt"></i> &nbsp;Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/rooms/home" className={({ isActive }) => (isActive ? "active" : "")}>
            <i className="fas fa-hotel"></i>&nbsp;Rooms
          </NavLink>
        </li>
        <li>
          <NavLink to="/reports" className={({ isActive }) => (isActive ? "active" : "")}>
            <i className="fas fa-file-alt"></i> &nbsp;Reports
          </NavLink>
        </li>
        <li>
          <NavLink to="/settings" className={({ isActive }) => (isActive ? "active" : "")}>
            <i className="fas fa-cogs"></i> &nbsp;Settings
          </NavLink>
        </li>
      </ul>
    </div>
  );
}; 

export default Ownsidebar;