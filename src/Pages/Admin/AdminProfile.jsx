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

    // Fetch global stats
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URI}api/admin/stats`,
          { withCredentials: true }
        );
        setStats(res.data);
      } catch (error) {
        toast.error('Failed to load site statistics');
      }
    };

    // Fetch tags for dropdown
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

  // Add new tag handler
  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!newTag.trim()) return toast.warning('Tag name cannot be empty');

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URI}api/tags`,
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
    return <p className="text-center mt-10 text-red-500">Please log in to view this page.</p>;
  }

  const pieData = {
    labels: ['Posts', 'Comments', 'Users'],
    datasets: [
      {
        label: 'Site Stats',
        data: [stats.posts, stats.comments, stats.users],
        backgroundColor: ['#000000', '#4ade80', '#3b82f6'], // black, green, blue
        hoverOffset: 30,
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      {/* Profile Section */}
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
        <img
          src={user.photoURL || '/default-avatar.png'}
          alt="Admin Avatar"
          className="w-28 h-28 rounded-full object-cover shadow-md"
        />
        <div>
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="mb-10 max-w-md mx-auto">
        <Pie data={pieData} />
      </div>

      {/* Tag form + dropdown */}
      <div className="max-w-md mx-auto">
        <form onSubmit={handleAddTag} className="mb-4 flex gap-3">
          <input
            type="text"
            placeholder="Add a new tag..."
            className="flex-grow border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
          />
          <button
            type="submit"
            className="bg-black text-white px-6 rounded-md hover:bg-gray-900 transition"
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
        />
      </div>
    </div>
  );
};

export default AdminProfile;
