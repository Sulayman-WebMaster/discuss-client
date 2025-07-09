import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router';
import { AuthContext } from '../Provider/AuthProvider';
import { Bell } from 'lucide-react'; 
import Profile from './Profile';

const Header = () => {
  const { user } = useContext(AuthContext);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        
        <Link to="/" className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-black">Discuss.</h1>
        </Link>

        {/* Center: Navigation */}
        <nav className="hidden md:flex gap-8 font-medium text-gray-700">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'text-black font-semibold border-b-2 border-black pb-1' : 'hover:text-black transition'
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/membership"
            className={({ isActive }) =>
              isActive ? 'text-black font-semibold border-b-2 border-black pb-1' : 'hover:text-black transition'
            }
          >
            Membership
          </NavLink>
        </nav>

        
        <div className="flex items-center gap-6">
          
          <button className="relative text-gray-600 hover:text-black transition">
            <Bell className="w-7 h-7" />
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
