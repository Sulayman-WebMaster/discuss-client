import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router';
import {
  FaUserShield,
  FaUsersCog,
  FaExclamationTriangle,
  FaBullhorn,
  FaHome,
  FaBars,
  FaTimes
} from 'react-icons/fa';

const AdminDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Back Home', icon: <FaHome /> },
    { to: 'admin-profile', label: 'Admin Profile', icon: <FaUserShield /> },
    { to: 'manage-users', label: 'Manage Users', icon: <FaUsersCog /> },
    { to: 'reported', label: 'Reported Activities', icon: <FaExclamationTriangle /> },
    { to: 'announcements', label: 'Announcement', icon: <FaBullhorn /> },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen text-gray-900">

      <div className="md:hidden bg-black text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white text-2xl focus:outline-none">
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

    
      <div
        className={`${
          isOpen ? 'block' : 'hidden'
        } md:block bg-black text-white w-full md:w-64 p-6 space-y-6 shadow-lg transition-all duration-300`}
      >
        <h1 className="text-3xl font-extrabold mb-6 border-b border-gray-700 pb-2 hidden md:block">
          Admin Panel
        </h1>
        <nav className="flex flex-col md:gap-4 gap-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? 'bg-white text-black p-3 rounded-md font-semibold flex items-center gap-3 transition'
                  : 'hover:bg-gray-800 p-3 rounded-md flex items-center gap-3 transition'
              }
            >
              <span className="text-lg">{link.icon}</span> {link.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white p-4 md:p-8 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
