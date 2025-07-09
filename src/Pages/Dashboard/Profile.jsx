import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Provider/AuthProvider';
import { FaMedal } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [recentPosts, setRecentPosts] = useState([]);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    if (!user?.email) return;

    // Fetch 3 recent posts
    axios
      .get(`${import.meta.env.VITE_BASE_URI}api/posts/recent`, {
        withCredentials: true,
      })
      .then((res) => setRecentPosts(res.data.slice(0, 3)))
      .catch(() => toast.error('Failed to load posts'));

    // Check membership status
    axios
      .get(`${import.meta.env.VITE_BASE_URI}api/user/status?email=${user.email}`, {
        withCredentials: true,
      })
      .then((res) => setIsMember(res.data.isMember))
      .catch((err) => console.error('Membership check failed:', err));
  }, [user]);

  return (
    <div className="min-h-screen bg-white py-10 px-4 md:px-10">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* USER INFO */}
        <div className="bg-gray-100 p-8 rounded-xl shadow-md flex flex-col md:flex-row items-center gap-8">
          <img
            src={user?.photoURL}
            alt="User"
            className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-black object-cover"
          />
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-800">{user?.displayName}</h2>
            <p className="text-gray-600 text-sm mt-1">{user?.email}</p>

            <div className="flex justify-center md:justify-start gap-3 mt-4">
              <span className="inline-flex items-center bg-yellow-200 text-yellow-800 font-medium px-3 py-1 rounded-full text-sm">
                <FaMedal className="mr-2" />
                Bronze
              </span>
              {isMember && (
                <span className="inline-flex items-center bg-yellow-500 text-white font-medium px-3 py-1 rounded-full text-sm">
                  <FaMedal className="mr-2" />
                  Gold
                </span>
              )}
            </div>
          </div>
        </div>

        {/* RECENT POSTS */}
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center md:text-left">
            My Recent Posts
          </h3>

          {recentPosts.length === 0 ? (
            <p className="text-gray-500 text-center">You haven’t posted anything yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentPosts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition"
                >
                  <h4 className="text-lg font-bold text-gray-800 mb-2">{post.title}</h4>
                  <p className="text-gray-600 text-sm mb-3">
                    {post.description.length > 100
                      ? post.description.slice(0, 100) + '...'
                      : post.description}
                  </p>
                  <span className="inline-block bg-black text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {post.tag}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
