import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import { AuthContext } from '../Provider/AuthProvider';
import { toast } from 'react-toastify';
import {ThumbsUp, ThumbsDown, MessageCircle} from 'lucide-react';
import {
  FacebookShareButton,
  FacebookIcon
} from 'react-share';

const PostDetails = () => {
  const { user,userId } = useContext(AuthContext);
  const { id } = useParams();

 

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  const baseUrl = import.meta.env.VITE_BASE_URI;
  const shareUrl = window.location.href;

  const fetchPost = async () => {
    try {
      const res = await axios.get(`${baseUrl}api/posts/${id}`, { withCredentials: true });
      setPost(res.data.post);
      setComments(res.data.comments);
    } catch (err) {
      toast.error('Failed to load post');
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

 const handleVote = async (type) => {
  if (!user) return toast.info('Login to vote');

  try {
    const res = await axios.post(
      `${baseUrl}api/posts/${id}/vote`,
      {
        type,
        userId: userId,
      },
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
      const res = await axios.post(`${baseUrl}api/comments`, {
        postId: id,
        commentText,
        user: { name: user.displayName, image: user.photoURL }
      }, { withCredentials: true });
      setComments([res.data, ...comments]);
      setCommentText('');
      toast.success('Comment added');
    } catch (err) {
      toast.error('Could not add comment');
    }
  };

  if (!post) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
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

        <div className="space-y-4">
          {comments.map(c => (
            <div key={c._id} className="flex gap-3 items-start bg-gray-50 p-4 rounded-md">
              <img src={c.user.image || '/default.png'} alt="User"
                className="w-10 h-10 rounded-full" />
              <div>
                <p className="font-semibold text-gray-800">{c.user.name}</p>
                <p className="text-gray-700">{c.commentText}</p>
                <p className="text-xs text-gray-400">
                  {new Date(c.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PostDetails;
