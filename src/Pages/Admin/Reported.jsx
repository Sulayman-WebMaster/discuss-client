import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShieldAlert, Trash2, CheckCircle, Ban } from 'lucide-react';

const Reported = () => {
  const [reports, setReports] = useState([]);
  const baseUrl = import.meta.env.VITE_BASE_URI;

  const fetchReports = async () => {
    try {
      const res = await axios.get(`${baseUrl}api/comments/reported`, { withCredentials: true });
      setReports(res.data);
    } catch (err) {
      toast.error("Failed to load reports");
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleAction = async (id, action) => {
    try {
      await axios.put(`${baseUrl}api/comments/action/${id}`, { action }, { withCredentials: true });
      toast.success(`Action ${action} completed`);
      fetchReports();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <ShieldAlert className="text-red-500" /> Reported Comments
      </h1>

      {reports.length === 0 ? (
        <p className="text-gray-500">No reported comments.</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg border">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3">Comment</th>
                <th className="p-3">User</th>
                <th className="p-3">Feedback</th>
                <th className="p-3">Reported By</th>
                <th className="p-3">Reported At</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((c) => (
                <tr key={c._id} className="bg-white hover:bg-gray-50 border-b">
                  <td className="p-3">{c.commentText}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <img src={c.user?.image || '/default.png'} className="w-8 h-8 rounded-full" />
                      <div>
                        <p className="font-semibold">{c.user?.name}</p>
                        <p className="text-xs text-gray-500">{c.user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-red-600 font-medium">{c.report?.feedback}</td>
                  <td className="p-3">{c.report?.reportedBy}</td>
                  <td className="p-3 text-xs text-gray-500">
                    {new Date(c.report?.reportedAt).toLocaleString()}
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleAction(c._id, 'resolve')}
                        className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-xs flex items-center gap-1"
                      >
                        <CheckCircle size={16} /> Resolve
                      </button>
                      <button
                        onClick={() => handleAction(c._id, 'delete')}
                        className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs flex items-center gap-1"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                      <button
                        onClick={() => handleAction(c._id, 'block')}
                        className="px-3 py-1 rounded bg-black hover:bg-gray-900 text-white text-xs flex items-center gap-1"
                      >
                        <Ban size={16} /> Block User
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Reported;
