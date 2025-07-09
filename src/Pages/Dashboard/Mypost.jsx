import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Provider/AuthProvider';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

const MyPost = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URI}api/user/post`, {
        withCredentials: true,
      });
      setPosts(res.data);
    } catch (error) {
      toast.error('Failed to fetch your posts');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URI}api/${id}`, {
        withCredentials: true,
      });
      toast.success('Post deleted');
      setPosts(posts.filter((post) => post._id !== id));
    } catch (err) {
      toast.error('Failed to delete post');
    }
  };

  useEffect(() => {
    if (user?.email) fetchPosts();
  }, [user]);

  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">
          My Posts
        </h2>

        {posts.length === 0 ? (
          <div className="text-center text-gray-500 text-lg py-20">
            You haven't posted anything yet.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
            <table className="min-w-full table-auto text-sm text-gray-700">
              <thead>
                <tr className="bg-blue-100 text-blue-900 uppercase text-xs tracking-wide border-b">
                  <th className="px-6 py-4 text-left">Title</th>
                  <th className="px-6 py-4 text-left">Votes</th>
                  <th className="px-6 py-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post, idx) => (
                  <tr
                    key={post._id}
                    className={`border-b transition duration-300 ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'
                    } hover:bg-blue-100`}
                  >
                    <td className="px-6 py-4 font-medium">{post.title}</td>
                    <td className="px-6 py-4">{post.upVote - post.downVote}</td>
                    <td className="px-6 py-4 space-x-3">
                      <button
                        onClick={() => navigate(`/post/${post._id}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition"
                      >
                        Comment
                      </button>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default MyPost;
