import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router';
import {  ArrowDown, ArrowUp, Flame } from 'lucide-react';
import { BiRepost } from "react-icons/bi";
const Card = () => {
  const [posts, setPosts] = useState([]);
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const baseUrl = import.meta.env.VITE_BASE_URI;

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${baseUrl}api/posts`, {
        withCredentials: true,
        params: { page, sort }
      });

      setPosts(res.data.posts);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Failed to fetch posts', err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [sort, page]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-3 mb-10">
        <BiRepost className="w-10 h-10 text-black" />
        <h2 className="text-3xl font-bold text-black">Posts</h2>
      </div>
        <button
          onClick={() => setSort(sort === 'latest' ? 'popular' : 'latest')}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition text-sm font-medium"
        >
          <Flame className="w-4 h-4" />
          Sort by {sort === 'latest' ? 'Popularity' : 'Newest'}
        </button>
      </div>

      {posts.length === 0 ? (
        <p className="text-center text-gray-500 italic">No posts found.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition flex items-start gap-4"
            >
              <img
                src={post.authorImage || '/default-user.png'}
                alt="Author"
                className="w-14 h-14 rounded-full object-cover border"
              />
              <div className="flex-1">
                <Link
                  to={`/post/${post._id}`}
                  className="text-xl font-semibold text-gray-800 hover:underline"
                >
                  {post.title}
                </Link>

                <div className="flex flex-wrap gap-2 mt-2">
                  {post.tags?.map((tag) => (
                    <Link
                      to={`/tags/${tag}`}
                      key={tag}
                      className="bg-blue-50 text-blue-700 px-2 py-1 text-xs rounded-full hover:bg-blue-100 transition"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>

                <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500 items-center">
                  <span>{new Date(post.createdAt).toLocaleString()}</span>
                  
                  <span className="flex items-center gap-1 text-green-600">
                    <ArrowUp className="w-4 h-4" /> {post.upVote}
                  </span>
                  <span className="flex items-center gap-1 text-red-600">
                    <ArrowDown className="w-4 h-4" /> {post.downVote}
                  </span>
                  <span className="ml-2 font-medium text-gray-700">
                    Score: {post.upVote - post.downVote}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition ${
                page === i + 1
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default Card;
