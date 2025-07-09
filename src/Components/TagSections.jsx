import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Tag } from 'lucide-react'; 
import { Link } from 'react-router';

const TagsSections = () => {
  const [tags, setTags] = useState([]);

  const baseUrl = import.meta.env.VITE_BASE_URI;

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await axios.get(`${baseUrl}api/tag`);
        setTags(res.data);
      } catch (err) {
        console.error('Failed to load tags', err);
      }
    };

    fetchTags();
  }, []);

  return (
    <section className="py-12 px-2 bg-gray-50">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Explore More</h2>
        
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <Link
              to={`/tags/${tag.slug}`}
              key={tag._id}
              className="flex items-center gap-2 bg-white border border-gray-200 shadow-sm rounded-full px-4 py-2 text-sm text-gray-800 hover:bg-black hover:text-white transition"
            >
              <Tag className="w-4 h-4" />
              {tag.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TagsSections;
