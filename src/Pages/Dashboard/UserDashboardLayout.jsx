import React from 'react';
import { NavLink, Outlet } from 'react-router';
import { FaUser, FaPlusCircle, FaListUl } from 'react-icons/fa';

const UserDashboardLayout = () => {
  return (
    <div className="flex h-screen bg-white text-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-black text-white p-6 space-y-6 shadow-lg">
        <h1 className="text-3xl font-extrabold mb-6 border-b border-gray-700 pb-2">
          Dashboard
        </h1>
        <nav className="flex flex-col gap-4">
          <NavLink
            to="profile"
            className={({ isActive }) =>
              isActive
                ? 'bg-white text-black p-3 rounded-md font-semibold flex items-center gap-3 transition'
                : 'hover:bg-gray-800 p-3 rounded-md flex items-center gap-3 transition'
            }
          >
            <FaUser className="text-lg" /> My Profile
          </NavLink>

          <NavLink
            to="add-post"
            className={({ isActive }) =>
              isActive
                ? 'bg-white text-black p-3 rounded-md font-semibold flex items-center gap-3 transition'
                : 'hover:bg-gray-800 p-3 rounded-md flex items-center gap-3 transition'
            }
          >
            <FaPlusCircle className="text-lg" /> Add Post
          </NavLink>

          <NavLink
            to="my-posts"
            className={({ isActive }) =>
              isActive
                ? 'bg-white text-black p-3 rounded-md font-semibold flex items-center gap-3 transition'
                : 'hover:bg-gray-800 p-3 rounded-md flex items-center gap-3 transition'
            }
          >
            <FaListUl className="text-lg" /> My Posts
          </NavLink>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white p-8 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default UserDashboardLayout;
