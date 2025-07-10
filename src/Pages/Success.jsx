import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router';
import { toast } from 'react-toastify';
import { AuthContext } from '../Provider/AuthProvider';

const Success = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const session_id = new URLSearchParams(location.search).get('session_id');

  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!session_id || !user?.email) {
        setVerifying(false);
        return;
      }

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URI}api/verify-session`,
          { session_id },
          { withCredentials: true }
        );

        if (res.data.success) {
          setVerified(true);
          toast.success('Membership activated!');
        } else {
          toast.error('Failed to verify payment.');
        }
      } catch (err) {
        toast.error('Verification error.');
        console.error(err);
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [session_id, user]);

  if (verifying) {
    return (
      <div className="h-screen flex flex-col justify-center items-center text-gray-600">
        <div className="text-lg font-medium">Verifying your payment...</div>
        <div className="mt-2 text-sm">Please wait ⏳</div>
      </div>
    );
  }

  if (!verified) {
    return (
      <div className="h-screen flex flex-col justify-center items-center text-red-600 bg-red-50">
        <h1 className="text-2xl font-bold">Payment Verification Failed</h1>
        <p className="mt-2 text-sm">We couldn't confirm your subscription.</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-green-50 text-green-700">
      <h1 className="text-3xl font-bold">Subscription Successful!</h1>
      <p className="mt-4">Thank you for becoming a Gold Member!</p>
    </div>
  );
};

export default Success;
