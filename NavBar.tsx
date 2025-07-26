// components/NavBar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Utensils, Package, Brush} from 'lucide-react';
import './NavBar.css';

const NavBar: React.FC = () => {
  return (
    <div className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item">
          <Link to="/" className="navbar-link">
            <Home size={20} color="yellow" /> Home
          </Link>
        </li>
        <li className="navbar-item">
          <Link to="/kitchen" className="navbar-link">
            <Utensils size={20} color="blue" /> Kitchen
          </Link>
        </li>
        <li className="navbar-item">
          <Link to="/inventory" className="navbar-link">
            <Package size={20} color=   "orange" /> Inventory
          </Link>
        </li>
        <li className="navbar-item">
          <Link to="/housekeeping" className="navbar-link">
            <Brush size={20} color="magenta" /> HouseKeeping
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default NavBar;

