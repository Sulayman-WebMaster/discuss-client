import React, { useState, useRef, useEffect, useContext } from 'react';
import { FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
import { Link } from 'react-router';
import { AuthContext } from '../Provider/AuthProvider';
import axios from 'axios';

const Profile = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();
  const { user, handleLogout } = useContext(AuthContext);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = user?.displayName || 'Guest User';
  const email = user?.email || 'guest@example.com';
  const photoURL =
    user?.photoURL ||
    'https://i.postimg.cc/rmzgbYvr/Screenshot-2025-05-06-192351.png';
  
  const handleLogoutClick = async () => {
  handleLogout(); 

  try {
    await axios.post(`${import.meta.env.VITE_BASE_URI}logout`, {}, {
      withCredentials: true,
    });
    setOpen(false);
  } catch (error) {
    console.error('Logout error:', error?.response?.data || error.message);
  }
};

  
  const role = user?.role || 'user'; 


  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Avatar */}
      <div
        className="cursor-pointer group"
        onClick={() => setOpen(!open)}
      >
        <img
          src={photoURL}
          alt="Profile"
          className="w-12 h-12 rounded-full border-2 border-gray-800 object-cover shadow-md transition-transform duration-200 group-hover:scale-105"
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-4 w-80 bg-white border border-gray-300 rounded-2xl shadow-2xl z-50 animate-fade-in-up overflow-hidden">
          {/* Header */}
          <div className="flex items-start gap-4 px-5 py-4 bg-gray-50 border-b border-gray-200">
            <img
              src={photoURL}
              alt="User"
              className="w-14 h-14 rounded-full border object-cover"
            />
            <div className="text-left max-w-[190px]">
              <p className="text-base font-semibold text-gray-800">{displayName}</p>
              <p className="text-sm text-gray-500 break-all whitespace-normal">{email}</p>
            </div>
          </div>

          {/* Dashboard Link */}
          <Link
            to={role === 'admin' ? '/admin-dashboard' : '/user-dashboard'}
            className="flex items-center gap-3 px-5 py-3 text-gray-700 text-sm hover:bg-gray-100 transition-all"
            onClick={() => setOpen(false)}
          >
            <FaTachometerAlt className="text-gray-500" />
            {role === 'admin' ? 'Admin Dashboard' : 'User Dashboard'}
          </Link>

         
          <button
            onClick={handleLogoutClick}
            className="flex items-center gap-3 w-full text-left px-5 py-3 text-red-600 text-sm hover:bg-red-50 transition-all border-t border-gray-100"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
