import { NavLink } from "react-router-dom";
import "./Ownsidebar.css"; // Import layout CSS

const Sidebar = () => {
  return (
    <div className="sidebar">
     <h2 className="head-title">NexStay Hotel</h2><br/>
     <p className="sidebar-title"> <i class="fa fa-user-circle-o" aria-hidden="true"></i> &nbsp;Owner</p><br/>
      <ul className="sidebar-nav">
        <li>
         <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}><i class="fa fa-tachometer" aria-hidden="true"></i> &nbsp;Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="/rooms" className={({ isActive }) => (isActive ? "active" : "")}><i class="fa fa-university" aria-hidden="true"></i>&nbsp;Rooms</NavLink>
        </li>
        <li>
          <NavLink to="/reports" className={({ isActive }) => (isActive ? "active" : "")}><i class="fa fa-file" aria-hidden="true"></i> &nbsp;Reports</NavLink>
        </li>
        <li>
          <NavLink to="/settings" className={({ isActive }) => (isActive ? "active" : "")}><i class="fa fa-cog" aria-hidden="true"></i> &nbsp;Settings</NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;