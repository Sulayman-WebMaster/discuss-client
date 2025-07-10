import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 5;

  const fetchUsers = async (query = '', pageNum = 1) => {
    try {
      const url = query
        ? `${import.meta.env.VITE_BASE_URI}api/search/${query}?page=${pageNum}&limit=${limit}`
        : `${import.meta.env.VITE_BASE_URI}api/all?page=${pageNum}&limit=${limit}`;

      const res = await axios.get(url, { withCredentials: true });
      setUsers(Array.isArray(res.data.users) ? res.data.users : []);
      setTotal(typeof res.data.total === 'number' ? res.data.total : 0);
    } catch (err) {
      toast.error('Failed to load users');
      setUsers([]);
      setTotal(0);
    }
  };

  const handleMakeAdmin = async (id) => {
    try {
      await axios.patch(`${import.meta.env.VITE_BASE_URI}api/${id}/admin`, {}, { withCredentials: true });
      toast.success('User promoted to admin');
      fetchUsers(search, page);
    } catch {
      toast.error('Promotion failed');
    }
  };

  useEffect(() => {
    fetchUsers('', page);
  }, [page]);

  const totalPages = total && limit ? Math.ceil(total / limit) : 0;

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-semibold mb-4">Manage Users</h2>

      {/* Search Input + Button */}
      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by username..."
          className="px-4 py-2 border border-gray-300 rounded-md w-full sm:w-auto"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => {
            setPage(1);
            fetchUsers(search, 1);
          }}
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
        >
          Search
        </button>
      </div>

      {/* User Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Membership</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(users) &&
              users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3 capitalize">{user.role || 'user'}</td>
                  <td className="px-4 py-3">
                    {user.isMember ? (
                      <span className="text-green-600 font-medium">Active</span>
                    ) : (
                      <span className="text-red-600 font-medium">Inactive</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {user.role !== 'admin' ? (
                      <button
                        onClick={() => handleMakeAdmin(user._id)}
                        className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
                      >
                        Make Admin
                      </button>
                    ) : (
                      <span className="text-gray-500 italic">Already Admin</span>
                    )}
                  </td>
                </tr>
              ))}

            {Array.isArray(users) && users.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setPage(num)}
              className={`px-4 py-2 rounded-md ${
                page === num
                  ? 'bg-black text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              } transition`}
            >
              {num}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageUser;
