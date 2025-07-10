import React from 'react';
import { Link } from 'react-router';

const Unauthorized = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <img
        src="https://cdni.iconscout.com/illustration/premium/thumb/access-denied-5984887-4978883.png"
        alt="Unauthorized"
        className="w-full max-w-md mb-8"
      />
      <h1 className="text-4xl font-bold text-red-600 mb-2">403 - Unauthorized</h1>
      <p className="text-lg text-gray-700 mb-6 text-center">
        You do not have permission to access this page.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default Unauthorized;
