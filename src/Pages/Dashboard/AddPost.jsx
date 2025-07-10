import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../Provider/AuthProvider';
import Select from 'react-select';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';

const AddPost = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [postCount, setPostCount] = useState(0);
  const [isMember, setIsMember] = useState(false);
  const [canPost, setCanPost] = useState(true);
  const [loading, setLoading] = useState(true);

  const [tagOptions, setTagOptions] = useState([]);
  const [tag, setTag] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    visibility: true,
  });

  // Fetch tag options
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URI}api/tag`, {
        withCredentials: true,
      })
      .then((res) => setTagOptions(res.data))
      .catch(() => toast.error('Failed to fetch tags'));
  }, []);

  // Fetch user status & post count
  const fetchUserStatus = async () => {
    try {
      const [statusRes, countRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BASE_URI}api/user/status`, { withCredentials: true }),
        axios.get(`${import.meta.env.VITE_BASE_URI}api/count`, { withCredentials: true }),
      ]);

      return {
        isMember: statusRes.data.isMember,
        postCount: countRes.data.count,
      };
    } catch {
      toast.error('Failed to fetch user status');
      return { isMember: false, postCount: 0 };
    }
  };

  useEffect(() => {
    if (!user) return;

    (async () => {
      setLoading(true);
      const status = await fetchUserStatus();
      setIsMember(status.isMember);
      setPostCount(status.postCount);
      setCanPost(status.isMember || status.postCount < 5);
      setLoading(false);
    })();
  }, [user]);

  if (!user) {
    return <div className="text-center text-gray-500 mt-10">Loading user info...</div>;
  }

  if (loading) {
    return <div className="text-center text-gray-500 mt-10">Loading user status...</div>;
  }

  if (!canPost) {
    return (
      <div className="h-screen flex flex-col justify-center items-center px-4 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-20 w-20 mb-6 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="text-3xl font-bold text-red-600 mb-4">
          You’ve reached your 5-post limit!
        </h2>
        <p className="text-gray-500 mb-6">
          Upgrade your membership to post unlimited content.
        </p>
        <button
          onClick={() => navigate('/membership')}
          className="bg-black text-white px-6 py-3 rounded hover:bg-gray-900 transition"
        >
          Become a Member
        </button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tag) return toast.warning('Please select a tag.');

    const status = await fetchUserStatus();

    if (!status.isMember && status.postCount >= 5) {
      toast.error('You’ve reached your 5-post limit. Please upgrade.');
      setCanPost(false);
      return;
    }

    const postData = {
      authorName: user.displayName,
      authorEmail: user.email,
      authorImage: user.photoURL,
      title: formData.title,
      description: formData.description,
      tag: tag.value,
      upVote: 0,
      downVote: 0,
      visibility: formData.visibility,
      createdAt: new Date(),
    };

    try {
      await axios.post(`${import.meta.env.VITE_BASE_URI}api/posts`, postData, {
        withCredentials: true,
      });
      toast.success('Post added successfully!');
      setFormData({ title: '', description: '', visibility: true });
      setTag(null);

      const updatedStatus = await fetchUserStatus();
      setPostCount(updatedStatus.postCount);
      setIsMember(updatedStatus.isMember);
      setCanPost(updatedStatus.isMember || updatedStatus.postCount < 5);
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Error adding post');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">Add New Post</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-4 bg-gray-50 p-4 rounded border border-gray-200">
            <img
              src={user.photoURL}
              alt="Author"
              className="w-16 h-16 rounded-full border-2 border-black"
            />
            <div>
              <p className="font-semibold text-lg text-gray-800">Name: {user.displayName}</p>
              <p className="text-sm text-gray-500">Email: {user.email}</p>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Post Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter post title"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Post Description</label>
            <textarea
              required
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Write your post..."
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Tag</label>
            <Select
              options={tagOptions}
              value={tag}
              onChange={setTag}
              placeholder="Choose a tag"
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: '#d1d5db',
                  boxShadow: 'none',
                  '&:hover': {
                    borderColor: '#000',
                  },
                }),
              }}
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Visibility</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, visibility: true })}
                className={`flex items-center gap-2 px-4 py-2 rounded border ${
                  formData.visibility
                    ? 'bg-green-100 border-green-600 text-green-800'
                    : 'border-gray-300 text-gray-600'
                }`}
              >
                <Eye className="w-5 h-5" />
                Public
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, visibility: false })}
                className={`flex items-center gap-2 px-4 py-2 rounded border ${
                  formData.visibility === false
                    ? 'bg-red-100 border-red-600 text-red-800'
                    : 'border-gray-300 text-gray-600'
                }`}
              >
                <EyeOff className="w-5 h-5" />
                Private
              </button>
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition"
            >
              Submit Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPost;
