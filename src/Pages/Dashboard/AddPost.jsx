import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../Provider/AuthProvider';
import Select from 'react-select';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

const tagOptions = [
  { value: 'technology', label: 'Technology' },
  { value: 'education', label: 'Education' },
  { value: 'design', label: 'Design' },
  { value: 'lifestyle', label: 'Lifestyle' },
];

const AddPost = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [postCount, setPostCount] = useState(0);
  const [tag, setTag] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  useEffect(() => {
      if (user?.email) {
      axios
        .get(`${import.meta.env.VITE_BASE_URI}api/count`, {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        })
        .then((res) => setPostCount(res.data.count))
        .catch((err) => {
          console.error(err);
          toast.error('Failed to fetch post count');
        });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tag) return toast.warning('Please select a tag.');

    const postData = {
      authorName: user.displayName,
      authorEmail: user.email,
      authorImage: user.photoURL,
      title: formData.title,
      description: formData.description,
      tag: tag.value,
      upVote: 0,
      downVote: 0,
      createdAt: new Date(),
    };

    try {
      await axios.post(`${import.meta.env.VITE_BASE_URI}api/posts`, postData, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });
      toast.success('Post added successfully!');
      setFormData({ title: '', description: '' });
      setTag(null);
    } catch (err) {
      console.error(err);
      toast.error('Error adding post');
    }
  };

  if (!user)
    return (
      <div className="text-center text-gray-500 mt-10">Loading user info...</div>
    );

  if (postCount >= 5) {
    return (
      <div className="h-screen flex flex-col justify-center items-center">
        <h2 className="text-3xl font-bold text-red-600 mb-4">
          You’ve reached your 5-post limit!
        </h2>
        <p className="text-gray-500 mb-6">Upgrade to continue posting more content.</p>
        <button
          onClick={() => navigate('/membership')}
          className="bg-black text-white px-6 py-3 rounded hover:bg-gray-900 transition"
        >
          Become a Member
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">
          Add New Post
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Author Info */}
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

          {/* Post Title */}
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

          {/* Post Description */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Post Description</label>
            <textarea
              required
              rows="4"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Write your post..."
            />
          </div>

          {/* Tag Select */}
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

          {/* Submit Button */}
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
