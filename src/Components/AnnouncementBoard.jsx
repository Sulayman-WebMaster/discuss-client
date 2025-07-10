import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Megaphone, User, CalendarDays } from 'lucide-react';
import { toast } from 'react-toastify';

const AnnouncementBoard = () => {
  const [announcements, setAnnouncements] = useState([]);

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URI}api/annoucements`);
      setAnnouncements(res.data);
    } catch (err) {
      toast.error('Failed to fetch announcements');
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <div className=" px-4 py-12">
      <div className="flex items-center gap-3 mb-10">
        <Megaphone className="w-8 h-8 text-black" />
        <h2 className="text-3xl font-bold text-black">Latest Announcements</h2>
      </div>

      {announcements.length === 0 ? (
        <p className="text-gray-500 text-center">No announcements available yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {announcements.map((a) => (
            <div
              key={a._id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition duration-300"
            >
              <div className="flex items-center gap-4 p-5 border-b border-gray-100">
                <img
                  src={a.authorImage}
                  alt={a.authorName}
                  className="w-14 h-14 object-cover rounded-full border border-gray-300"
                />
                <div>
                  <h4 className="text-lg font-semibold text-black">{a.title}</h4>
                  <div className="flex items-center text-sm text-gray-600 mt-1 gap-1">
                    <User className="w-4 h-4" />
                    {a.authorName}
                  </div>
                </div>
              </div>

              <div className="px-5 py-4 text-sm text-gray-700 line-clamp-4">
                {a.description}
              </div>

              <div className="px-5 pb-4 flex items-center text-xs text-gray-500 gap-1">
                <CalendarDays className="w-4 h-4" />
                {new Date(a.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnnouncementBoard;
