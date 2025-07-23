import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../theme/ThemeToggle';

const Navbar = () => {
  return (
    <nav className="navbar bg-dark-800 text-white p-3 shadow-md">
      <h1 className="logo text-xl font-bold">
        <Link to="/">Duty Roster</Link>
      </h1>
      <div className="flex items-center">
        <ul className="flex space-x-4 mr-4">
          <li>
            <Link to="/" className="hover:text-primary-400 transition-colors">Dashboard</Link>
          </li>
          <li>
            <Link to="/calendar" className="hover:text-primary-400 transition-colors">Calendar</Link>
          </li>
          <li>
            <Link to="/people" className="hover:text-primary-400 transition-colors">People</Link>
          </li>
          <li>
            <Link to="/duties" className="hover:text-primary-400 transition-colors">Duties</Link>
          </li>
          <li>
            <Link to="/admin" className="hover:text-primary-400 transition-colors">Admin</Link>
          </li>
        </ul>
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Navbar;