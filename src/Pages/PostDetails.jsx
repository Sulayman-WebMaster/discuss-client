import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import { AuthContext } from '../Provider/AuthProvider';
import { toast } from 'react-toastify';
import { ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';
import {
  FacebookShareButton,
  FacebookIcon
} from 'react-share';

const PostDetails = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const userEmail = user ? user.email : null;

  const [post, setPost] = useState(null);
  const [userId, setUserId] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const COMMENTS_PER_PAGE = 5;
  const baseUrl = import.meta.env.VITE_BASE_URI;
  const shareUrl = window.location.href;

  const feedbackOptions = [
    'Spam or irrelevant',
    'Harassment or hate speech',
    'Inappropriate content',
  ];

  const fetchUserByEmail = async (userEmail) => {
    try {
      const res = await axios.get(`${baseUrl}api/user/${userEmail}`, {
        withCredentials: true,
      });
      setUserId(res.data._id);
    } catch (err) {
      console.error(err.response?.data?.message || 'Fetch failed');
    }
  };

  const fetchPost = async () => {
    try {
      const res = await axios.get(`${baseUrl}api/posts/${id}`, {
        withCredentials: true
      });
      setPost(res.data.post);
      setComments(res.data.comments.map(c => ({
        ...c,
        feedback: '',
        reported: !!c.report,
      })));
    } catch (err) {
      toast.error('Failed to load post');
    }
  };

  useEffect(() => {
    fetchPost();
    const timer = setTimeout(() => {
      if (userEmail) fetchUserByEmail(userEmail);
    }, 3000);
    return () => clearTimeout(timer);
  }, [id, userEmail]);

  const handleVote = async (type) => {
    if (!user) return toast.info('Login to vote');

    try {
      const res = await axios.post(
        `${baseUrl}api/posts/${id}/vote`,
        { type, userId },
        { withCredentials: true }
      );

      setPost({
        ...post,
        upVote: res.data.upVote,
        downVote: res.data.downVote,
      });
    } catch (err) {
      toast.error('Vote failed');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) return toast.info('Login to comment');
    if (!commentText.trim()) return;

    try {
      const res = await axios.post(
        `${baseUrl}api/comments`,
        {
          postId: id,
          commentText,
          user: { name: user.displayName, image: user.photoURL, email: user.email }
        },
        { withCredentials: true }
      );
      setComments([
        {
          ...res.data,
          feedback: '',
          reported: false,
        },
        ...comments
      ]);
      setCommentText('');
      setCurrentPage(1); // Reset pagination on new comment
      toast.success('Comment added');
    } catch (err) {
      toast.error('Could not add comment');
    }
  };

  const handleFeedbackChange = (index, value) => {
    const updated = [...comments];
    updated[index].feedback = value;
    setComments(updated);
  };

  const handleReport = async (commentId, index) => {
    if (!userEmail) return toast.info("Login required");

    const selectedFeedback = comments[index].feedback;
    if (!selectedFeedback) return toast.warning("Select feedback first");

    try {
      await axios.put(
        `${baseUrl}api/comments/report/${commentId}`,
        {
          feedback: selectedFeedback,
          reportedBy: userEmail,
        },
        { withCredentials: true }
      );

      const updated = [...comments];
      updated[index].reported = true;
      setComments(updated);
      toast.success("Report submitted");
    } catch (err) {
      toast.error("Failed to report");
    }
  };

  const totalPages = Math.ceil(comments.length / COMMENTS_PER_PAGE);
  const paginatedComments = comments.slice(
    (currentPage - 1) * COMMENTS_PER_PAGE,
    currentPage * COMMENTS_PER_PAGE
  );

  if (!post) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="bg-white rounded-md shadow-md p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-4">
          <img src={post.authorImage || '/default.png'} alt="Author"
            className="w-12 h-12 rounded-full" />
          <div>
            <p className="text-gray-800 font-semibold">{post.authorName}</p>
            <p className="text-gray-500 text-sm">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="ml-auto flex gap-2">
            <button onClick={() => handleVote('up')}
              className="flex items-center gap-1 text-green-600 hover:text-green-800 transition">
              <ThumbsUp /> {post.upVote}
            </button>
            <button onClick={() => handleVote('down')}
              className="flex items-center gap-1 text-red-600 hover:text-red-800 transition">
              <ThumbsDown /> {post.downVote}
            </button>
            <FacebookShareButton url={shareUrl}>
              <FacebookIcon size={24} round />
            </FacebookShareButton>
          </div>
        </div>

        {/* Title & Body */}
        <h1 className="text-2xl font-bold">{post.title}</h1>
        <p className="text-gray-700">{post.description}</p>
        <div className="flex flex-wrap gap-2">
          {post.tags?.map(tag => (
            <span key={tag} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Comments Section */}
      <section className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">
          <MessageCircle className="inline-block mr-2" />
          {comments.length} Comments
        </h2>

        {user ? (
          <form onSubmit={handleComment} className="space-y-2">
            <textarea
              rows="3"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write your comment..."
              className="w-full border rounded-md p-3 focus:ring-2 focus:ring-black transition"
            />
            <button type="submit"
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
              Post Comment
            </button>
          </form>
        ) : (
          <p className="text-gray-500 italic">Please login to comment or vote.</p>
        )}

        {/* Comments Table */}
        <div className="overflow-x-auto">
          <table className="w-full mt-6 text-sm text-left border-collapse rounded-lg overflow-hidden shadow-md">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-3 border-b">User</th>
                <th className="p-3 border-b">Comment</th>
                <th className="p-3 border-b">Feedback</th>
                <th className="p-3 border-b text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedComments.map((c, index) => (
                <tr key={c._id} className="bg-white hover:bg-gray-50 transition">
                  <td className="p-3 border-b font-medium text-gray-800">
                    {c.user?.name || 'Anonymous'}
                  </td>
                  <td className="p-3 border-b text-gray-700">{c.commentText}</td>
                  <td className="p-3 border-b">
                    <select
                      value={c.feedback}
                      onChange={(e) =>
                        handleFeedbackChange(
                          (currentPage - 1) * COMMENTS_PER_PAGE + index,
                          e.target.value
                        )
                      }
                      disabled={c.reported}
                      className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option value="">Select Feedback</option>
                      {feedbackOptions.map((f, i) => (
                        <option key={i} value={f}>{f}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3 border-b text-center">
                    <button
                      disabled={!c.feedback || c.reported}
                      onClick={() =>
                        handleReport(c._id, (currentPage - 1) * COMMENTS_PER_PAGE + index)
                      }
                      className={`px-4 py-1.5 rounded-md font-medium text-white transition-all duration-150 ${
                        c.reported
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-black hover:bg-gray-800'
                      }`}
                    >
                      {c.reported ? 'Reported' : 'Report'}
                    </button>
                  </td>
                </tr>
              ))}
              {comments.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center p-5 text-gray-500">
                    No comments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-4 gap-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-1 border rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-700 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-1 border rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default PostDetails;
