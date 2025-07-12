import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import { MessageCircle, ThumbsDown, ThumbsUp } from 'lucide-react';

const TagPosts = () => {
  const { tag } = useParams();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [commentCounts, setCommentCounts] = useState({});
  const baseUrl = import.meta.env.VITE_BASE_URI;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${baseUrl}api/posts/tag/${tag}`, {
          params: { page },
        });
        setPosts(res.data.posts);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error('Error fetching tagged posts:', err);
      }
    };

    fetchPosts();
  }, [tag, page]);

  useEffect(() => {
    const fetchCommentCounts = async () => {
      const counts = {};
      for (const post of posts) {
        try {
          const res = await axios.get(`${baseUrl}api/comments/count?postId=${post._id}`);
          counts[post._id] = res.data.count || 0;
        } catch {}
      }
      setCommentCounts(counts);
    };

    if (posts.length > 0) fetchCommentCounts();
  }, [posts]);

  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6">
        Posts tagged with <span className="text-blue-600">#{tag}</span>
      </h2>

      {posts.length === 0 ? (
        <p className="text-gray-500 italic">No posts found for this tag.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post._id} className="bg-white border rounded-xl p-5">
              <h3 className="text-xl font-semibold text-gray-800">{post.title}</h3>
              <div className="mt-2 text-sm text-gray-600 flex flex-wrap gap-4">
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
                <span className="ml-2 font-semibold">
                  Score: {post.upVote - post.downVote}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex justify-center gap-2 flex-wrap">
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

export default TagPosts;
