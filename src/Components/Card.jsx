import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router';
import {
  Flame,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
} from 'lucide-react';
import { BiRepost } from 'react-icons/bi';

const Card = () => {
  const [posts, setPosts] = useState([]);
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [commentCounts, setCommentCounts] = useState({});
  const baseUrl = import.meta.env.VITE_BASE_URI;

  // Fetch posts
  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${baseUrl}api/posts`, {
        withCredentials: true,
        params: { page, sort },
      });
      setPosts(res.data.posts);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Failed to fetch posts', err);
    }
  };

  // Fetch comment counts for each post
  const fetchCommentCounts = async (posts) => {
    try {
      const counts = {};
      for (const post of posts) {
        const res = await axios.get(`${baseUrl}api/comments/count?postId=${post._id}`);
        counts[post._id] = res.data.count || 0;
      }
      setCommentCounts(counts);
    } catch (e) {
      console.error('Failed to fetch comment counts', e);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [sort, page]);

  useEffect(() => {
    if (posts.length > 0) {
      fetchCommentCounts(posts);
    }
  }, [posts]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <BiRepost className="w-8 h-8 text-black" />
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
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 flex items-start gap-5"
            >
              <img
                src={post.authorImage || '/default-user.png'}
                alt="Author"
                className="w-14 h-14 rounded-full object-cover border shadow"
              />

              <div className="flex-1">
                <Link
                  to={`/post/${post._id}`}
                  className="text-xl font-semibold text-gray-800 hover:underline"
                >
                  {post.title}
                </Link>

                {post.tag && (
                  <div className="mt-2">
                    <Link
                      to={`/tags/${post.tag}`}
                      className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-200 transition"
                    >
                      #{post.tag}
                    </Link>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600 items-center">
                  <span>{new Date(post.createdAt).toLocaleString()}</span>

                  <span className="flex items-center gap-1 text-green-600 font-medium">
                    <ThumbsUp className="w-4 h-4" /> {post.upVote}
                  </span>

                  <span className="flex items-center gap-1 text-red-600 font-medium">
                    <ThumbsDown className="w-4 h-4" /> {post.downVote}
                  </span>

                  <span className="flex items-center gap-1 text-blue-600 font-medium">
                    <MessageCircle className="w-4 h-4" />
                    {commentCounts[post._id] ?? 0}
                  </span>

                  <span className="ml-2 text-gray-800 font-semibold">
                    Score: {post.upVote - post.downVote}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
