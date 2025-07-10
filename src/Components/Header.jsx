import React, { useContext, useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router';
import { AuthContext } from '../Provider/AuthProvider';
import { Bell } from 'lucide-react';
import Profile from './Profile';
import axios from 'axios';

const Header = () => {
  const { user } = useContext(AuthContext);
  const [announcementCount, setAnnouncementCount] = useState(0);

  const fetchAnnouncementCount = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URI}api/annoucements`);
      setAnnouncementCount(res.data.length || 0);
    } catch (err) {
      setAnnouncementCount(0);
    }
  };

  useEffect(() => {
    fetchAnnouncementCount();
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto  py-3 flex items-center justify-between">

        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-black">Discuss.</h1>
        </Link>

        {/* Center: Navigation */}
        <nav className="hidden md:flex gap-8 font-medium text-gray-700">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? 'text-black font-semibold border-b-2 border-black pb-1'
                : 'hover:text-black transition'
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/membership"
            className={({ isActive }) =>
              isActive
                ? 'text-black font-semibold border-b-2 border-black pb-1'
                : 'hover:text-black transition'
            }
          >
            Membership
          </NavLink>
        </nav>

        {/* Right: Bell + Profile/Login */}
        <div className="flex items-center gap-6 relative">
          <button
            className={`relative text-gray-600 hover:text-black transition ${
              announcementCount > 0 ? 'animate-shake' : ''
            }`}
          >
            <Bell className="w-7 h-7" />
            {announcementCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {announcementCount}
              </span>
            )}
          </button>

          {user ? (
            <Profile />
          ) : (
            <Link to="/login">
              <button className="bg-black text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-gray-800 transition">
                Join Us
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
