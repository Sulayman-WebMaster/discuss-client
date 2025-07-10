import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Provider/AuthProvider';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';

const POSTS_PER_PAGE = 5;

const MyPost = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
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

  const handleVisibilityToggle = async (id, currentVisibility) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_BASE_URI}api/visibility/${id}`,
        { visibility: !currentVisibility },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      );
      toast.success('Visibility updated');
      setPosts((prev) =>
        prev.map((post) =>
          post._id === id ? { ...post, visibility: !currentVisibility } : post
        )
      );
    } catch (err) {
      toast.error('Failed to update visibility');
    }
  };

  useEffect(() => {
    if (user?.email) fetchPosts();
  }, [user]);

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const paginatedPosts = posts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <section className="w-full min-h-screen bg-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-black mb-10">
          My Posts
        </h2>

        {posts.length === 0 ? (
          <div className="text-center text-gray-500 text-lg py-20">
            You haven't posted anything yet.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl shadow-md bg-white border border-gray-200">
              <table className="min-w-full table-auto text-sm text-gray-800">
                <thead>
                  <tr className="bg-gray-100 text-black uppercase text-xs tracking-wide border-b">
                    <th className="px-6 py-4 text-left">Title</th>
                    <th className="px-6 py-4 text-left">Votes</th>
                    <th className="px-6 py-4 text-left">Visibility</th>
                    <th className="px-6 py-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPosts.map((post, idx) => (
                    <tr
                      key={post._id}
                      className={`border-b ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } hover:bg-gray-100 transition`}
                    >
                      <td className="px-6 py-4 font-medium">{post.title}</td>
                      <td className="px-6 py-4">{post.upVote - post.downVote}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            handleVisibilityToggle(post._id, post.visibility)
                          }
                          className={`flex items-center gap-2 text-sm px-3 py-1 rounded-full border transition ${
                            post.visibility
                              ? 'bg-black text-white border-black'
                              : 'bg-white text-black border-gray-400'
                          } hover:opacity-80`}
                        >
                          {post.visibility ? <Eye size={16} /> : <EyeOff size={16} />}
                          {post.visibility ? 'Public' : 'Private'}
                        </button>
                      </td>
                      <td className="px-6 py-4 space-x-3">
                        <button
                          onClick={() => navigate(`/post/${post._id}`)}
                          className="bg-black hover:bg-gray-900 text-white text-xs font-medium px-4 py-2 rounded-lg transition"
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

            {/* Pagination Controls */}
            <div className="mt-8 flex justify-center items-center gap-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="bg-black text-white px-6 py-2 rounded-lg disabled:opacity-40 transition"
              >
                Previous
              </button>
              <span className="text-black font-semibold">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="bg-black text-white px-6 py-2 rounded-lg disabled:opacity-40 transition"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default MyPost;
