import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../Provider/AuthProvider';
import { toast } from 'react-toastify';

const Membership = () => {
  const { user } = useContext(AuthContext);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch membership status
  useEffect(() => {
    if (!user?.email) return;

    const fetchStatus = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URI}api/user/status`, {
          withCredentials: true,
        });
        setIsMember(res.data.isMember);
      } catch (err) {
        console.error('Failed to fetch status');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [user]);

  const handleSubscribe = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URI}api/create-checkout-session`,
        { email: user.email },
        { withCredentials: true }
      );
      window.location.href = res.data.url;
    } catch (err) {
      toast.error('Subscription failed.');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center mt-10 text-gray-500">Checking membership...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-6 text-center">
        {isMember ? (
          <>
            <h2 className="text-3xl font-bold text-green-700 mb-4">You're already a Gold Member!</h2>
            <p className="text-gray-600 mb-6">Enjoy unlimited posting and your golden badge.</p>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Gold Membership</h2>
            <p className="text-gray-600 mb-6">
              Unlock unlimited posting and gold badge.
            </p>
            <div className="text-4xl font-extrabold text-black mb-6">$4.99<span className="text-base font-normal">/month</span></div>
            <button
              onClick={handleSubscribe}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition"
            >
              Subscribe Now
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Membership;
