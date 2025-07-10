import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { AuthContext } from '../../Provider/AuthProvider';
import { FaFileAlt, FaComments, FaUsers, FaTags } from 'react-icons/fa';

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminProfile = () => {
  const { user, loading: authLoading } = useContext(AuthContext);

  const [stats, setStats] = useState({ posts: 0, comments: 0, users: 0 });
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [newTag, setNewTag] = useState('');
  const [loadingTags, setLoadingTags] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URI}api/all/admin/stats`,
          { withCredentials: true }
        );
        setStats(res.data);
      } catch {
        toast.error('Failed to load site statistics');
      }
    };

    const fetchTags = async () => {
      setLoadingTags(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URI}api/tags`,
          { withCredentials: true }
        );
        setTags(res.data.map((tag) => ({ value: tag._id, label: tag.name })));
      } catch {
        toast.error('Failed to load tags');
      } finally {
        setLoadingTags(false);
      }
    };

    fetchStats();
    fetchTags();
  }, [user]);

  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!newTag.trim()) return toast.warning('Tag name cannot be empty');

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URI}api/tag-post`,
        { name: newTag.trim() },
        { withCredentials: true }
      );
      const addedTag = { value: res.data._id, label: res.data.name };
      setTags((prev) => [...prev, addedTag]);
      setSelectedTag(addedTag);
      setNewTag('');
      toast.success('Tag added successfully');
    } catch {
      toast.error('Failed to add tag');
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!user) {
    return <p className="text-center mt-10 text-red-500 font-semibold">Please log in to view this page.</p>;
  }

  const pieData = {
    labels: ['Posts', 'Comments', 'Users'],
    datasets: [
      {
        label: 'Site Stats',
        data: [stats.posts, stats.comments, stats.users],
        backgroundColor: ['#111827', '#10b981', '#3b82f6'],
        borderColor: '#fff',
        borderWidth: 2,
        hoverOffset: 35,
      },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto p-10 bg-white rounded-2xl shadow-xl ">
      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Welcome Back, <span className="text-indigo-600">{user.name?.split(' ')[0] || 'Admin'}</span>!
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto mt-2">
          Overview of your site statistics and tag management.
        </p>
      </header>

      {/* Profile Info */}
      <section className="flex flex-col sm:flex-row items-center gap-8 mb-12">
        <img
          src={user.photoURL || '/default-avatar.png'}
          alt="Admin Avatar"
          className="w-32 h-32 rounded-full object-cover shadow-md border-4 border-indigo-600"
        />
        <div className="text-center sm:text-left">
          <h2 className="text-3xl font-semibold text-gray-800">{user.name}</h2>
          <p className="text-gray-500 mb-1">{user.email}</p>
          <p className="text-gray-500 italic">Role: Admin</p>
        </div>
      </section>

      {/* Stats Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <StatCard icon={<FaFileAlt size={28} />} title="Total Posts" value={stats.posts} color="bg-indigo-600" />
        <StatCard icon={<FaComments size={28} />} title="Total Comments" value={stats.comments} color="bg-emerald-500" />
        <StatCard icon={<FaUsers size={28} />} title="Total Users" value={stats.users} color="bg-blue-500" />
      </section>

      {/* Pie Chart */}
      <section className="max-w-lg mx-auto mb-14 shadow-lg rounded-lg p-6 border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-center">Site Statistics Overview</h3>
        <Pie data={pieData} />
      </section>

      {/* Tag Form + Dropdown */}
      <section className="max-w-md mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <FaTags size={22} className="text-indigo-600" />
          <h4 className="text-lg font-semibold">Manage Tags</h4>
        </div>
        <form onSubmit={handleAddTag} className="mb-6 flex gap-3">
          <input
            type="text"
            placeholder="Add a new tag..."
            className="flex-grow border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
          />
          <button
            type="submit"
            className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-900 transition"
          >
            Add Tag
          </button>
        </form>

        <Select
          isLoading={loadingTags}
          options={tags}
          value={selectedTag}
          onChange={setSelectedTag}
          placeholder="Select a tag"
          className="text-sm"
          classNamePrefix="select"
          isClearable
          styles={{
            control: (base) => ({
              ...base,
              borderColor: '#000',
              boxShadow: 'none',
              '&:hover': { borderColor: '#333' },
            }),
          }}
        />
      </section>

      {/* Footer */}
      <footer className="mt-16 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} YourSiteName. Admin Dashboard.
      </footer>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => (
  <div className={`p-6 rounded-lg shadow-md text-white flex items-center gap-4 ${color}`}>
    <div className="p-3 bg-black bg-opacity-30 rounded-full">{icon}</div>
    <div>
      <p className="text-3xl font-semibold">{value}</p>
      <p className="mt-1">{title}</p>
    </div>
  </div>
);

export default AdminProfile;
