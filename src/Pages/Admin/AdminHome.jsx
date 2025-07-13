import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Users, Shield, CheckCircle } from 'lucide-react'; 
import { Link } from 'react-router';

const AdminHome = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    activeMembers: 0,
  });
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URI}api/admin/stats`, { withCredentials: true });
        setStats(res.data);
      } catch (err) {
        toast.error('Failed to load stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white shadow rounded-lg p-6 flex items-center gap-4">
          <Users className="w-10 h-10 text-black" />
          <div>
            <p className="text-sm font-medium text-gray-500">Total Users</p>
            <p className="text-2xl font-semibold">{stats.totalUsers}</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 flex items-center gap-4">
          <Shield className="w-10 h-10 text-black" />
          <div>
            <p className="text-sm font-medium text-gray-500">Total Admins</p>
            <p className="text-2xl font-semibold">{stats.totalAdmins}</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 flex items-center gap-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
          <div>
            <p className="text-sm font-medium text-gray-500">Active Members</p>
            <p className="text-2xl font-semibold">{stats.activeMembers}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <Link to="/admin-dashboard/manage-users"
          
          className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-900 transition font-semibold"
        >
          Manage Users
        </Link>
        <Link
          to="/admin-dashboard/reported"
          className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-900 transition font-semibold"
        >
          Manage Posts
        </Link>
            </div>
    </div>
  );
};

export default AdminHome;
