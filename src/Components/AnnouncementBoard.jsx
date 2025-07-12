import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Megaphone,
  User,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'react-toastify';

const AnnouncementBoard = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(3); 
  const baseUrl = import.meta.env.VITE_BASE_URI;

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get(`${baseUrl}api/annoucements`);
      setAnnouncements(res.data);
      } catch (err) {
      toast.error('Failed to fetch announcements');
    }
  };

  useEffect(() => {
    fetchAnnouncements();
    handleResize(); // initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleResize = () => {
    const width = window.innerWidth;
    if (width < 640) {
      setCardsPerPage(1); // mobile
    } else if (width < 1024) {
      setCardsPerPage(2); // tablet
    } else {
      setCardsPerPage(3); // desktop
    }
    setCurrentPage(0); // reset page on resize
  };

  const totalPages = Math.ceil(announcements.length / cardsPerPage);

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const visibleAnnouncements = announcements.slice(
    currentPage * cardsPerPage,
    currentPage * cardsPerPage + cardsPerPage
  );

  return (
    <div className="relative px-4 py-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-10">
        <Megaphone className="w-8 h-8 text-black" />
        <h2 className="text-3xl font-bold text-black">Latest Announcements</h2>
      </div>

      {announcements.length === 0 ? (
        <p className="text-center text-gray-500">No announcements available yet.</p>
      ) : (
        <div className="relative">
          {/* Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-[-2rem] top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full shadow p-2 hover:bg-gray-100 disabled:opacity-50"
            disabled={currentPage === 0}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-[-2rem] top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full shadow p-2 hover:bg-gray-100 disabled:opacity-50"
            disabled={currentPage >= totalPages - 1}
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Cards */}
          <div
            className={`grid gap-6 transition-all duration-500 ${
              cardsPerPage === 1
                ? 'grid-cols-1'
                : cardsPerPage === 2
                ? 'grid-cols-2'
                : 'grid-cols-3'
            }`}
          >
            {visibleAnnouncements.map((a) => (
              <div
                key={a._id}
                className="bg-white rounded-xl border border-gray-200 shadow p-5 h-full flex flex-col"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={a.authorImage || '/default-user.png'}
                    alt={a.authorName}
                    className="w-14 h-14 object-cover rounded-full border border-gray-300"
                  />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">{a.title}</h4>
                    <div className="flex items-center text-sm text-gray-600 mt-1 gap-1">
                      <User className="w-4 h-4" />
                      {a.authorName}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-4 line-clamp-4">{a.description}</p>
                <div className="flex items-center text-xs text-gray-500 gap-1 mt-auto pt-2 border-t">
                  <CalendarDays className="w-4 h-4" />
                  {new Date(a.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementBoard;
