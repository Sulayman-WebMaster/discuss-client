import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AnnouncementForm = () => {
  const [authorName, setAuthorName] = useState('');
  const [authorImage, setAuthorImage] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [announcements, setAnnouncements] = useState([]);

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URI}api/annoucements`);
      setAnnouncements(res.data);
    } catch {
      toast.error('Could not fetch announcements');
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append('authorName', authorName);
      form.append('title', title);
      form.append('description', description);
      if (authorImage) form.append('authorImage', authorImage);

      await axios.post(
        `${import.meta.env.VITE_BASE_URI}api/annoucement`,
        form,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      toast.success('Announcement created!');
      setAuthorName('');
      setTitle('');
      setDescription('');
      setAuthorImage(null);
      fetchAnnouncements();
    } catch {
      toast.error('Error creating announcement');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 sm:p-10 bg-white rounded-lg shadow-lg mt-16">
      <h2 className="text-3xl  font-bold mb-8">Create Announcement</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <div>
          <label className="block mb-1 font-medium">Author Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAuthorImage(e.target.files[0])}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Author Name</label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full border px-4 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-4 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-4 py-2 rounded"
            rows={4}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition"
        >
          Publish Announcement
        </button>
      </form>

      <hr className="mb-8" />

      {/* Latest Announcements */}
      <h3 className="text-2xl font-semibold mb-6">Latest Announcements</h3>
      <div className="space-y-6">
        {announcements.slice(0, 3).map((a) => (
          <div
            key={a._id}
            className="w-full flex items-start gap-4 p-5 border rounded-lg shadow-sm bg-gray-50"
          >
            {a.authorImage && (
              <img
                src={a.authorImage}
                alt="Author"
                className="w-20 h-20 rounded-full object-cover border border-gray-300"
              />
            )}
            <div className="flex-1">
              <h4 className="text-xl font-bold">{a.title}</h4>
              <p className="text-gray-500 text-sm mb-1">By {a.authorName}</p>
              <p className="text-gray-700 mb-2">{a.description}</p>
              <p className="text-gray-400 text-xs">
                {new Date(a.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementForm;
