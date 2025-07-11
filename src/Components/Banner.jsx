import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import bannerImage from '../assets/banner.jpg';
import { Search, LoaderCircle } from 'lucide-react';

const Banner = () => {
  const baseUrl = import.meta.env.VITE_BASE_URI?.replace(/\/?$/, '/');
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [popularTags, setPopularTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef();

  
  const fetchPopularTags = async () => {
    try {
      const res = await axios.get(`${baseUrl}api/search/popular-tag`);
      setPopularTags(res.data);
      console.log(res.data)
    } catch (err) {
      console.error('Failed to load popular tags');
    }
  };

  
  const handleSearch = async (tag) => {
    if (!tag.trim()) return;
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}api/search-tag?tag=${tag}`);
      setResults(res.data);
      setShowResults(true);
    } catch (err) {
      setResults([]); 
      setShowResults(true);
      console.error('Search failed', err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const goToPost = (id) => {
    navigate(`/post/${id}`);
    setShowResults(false);
    setSearch('');
    setResults([]);
  };

 
  useEffect(() => {
    fetchPopularTags();

    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <section className="w-full min-h-[70vh] relative flex items-center justify-center overflow-hidden">
      <img src={bannerImage} alt="Banner" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/30"></div>

      <motion.div
        className="relative z-10 text-center px-4 max-w-2xl w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Discuss. Learn. Grow Together.</h1>
        <p className="text-lg text-white/90 mb-6">Join a friendly community of learners and creators sharing knowledge daily.</p>

        {/* Search bar + results */}
        <div className="relative w-full max-w-xl mx-auto" ref={wrapperRef}>
          <div className="flex items-center gap-2 bg-white rounded-full px-4 py-3 shadow-lg border border-gray-200">
            <Search className="text-gray-500" size={20} />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                handleSearch(e.target.value);
              }}
              placeholder="Search topics (e.g. react, food, tech)..."
              className="flex-1 outline-none text-black placeholder-gray-500 bg-transparent"
            />
            {loading && <LoaderCircle className="animate-spin text-gray-400" size={18} />}
          </div>

          {/* Dropdown: search results or no result */}
          {showResults && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl mt-2 max-h-64 overflow-auto shadow-lg z-50">
              {results.length > 0 ? (
                results.map(post => (
                  <div
                    key={post._id}
                    onClick={() => goToPost(post._id)}
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-left transition"
                  >
                    <h3 className="font-semibold text-black">{post.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{post.description}</p>
                    <p className="text-xs text-blue-500 mt-1">#{post.tag}</p>
                  </div>
                ))
              ) : (
                <p className="px-4 py-3 text-gray-500 text-sm">No posts found.</p>
              )}
            </div>
          )}
        </div>

        {/* Popular tags */}
        {popularTags.length > 0 && (
          <div className="mt-6 text-white text-sm">
            <p className="mb-2">Popular Searches:</p>
            <div className="flex flex-wrap justify-center gap-4">
              {popularTags.map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSearch(tag);
                    handleSearch(tag);
                  }}
                  className="text-white hover:underline underline-offset-4 transition text-sm"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default Banner;
