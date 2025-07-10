import React from 'react';
import { Link } from 'react-router';

const NotFound = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white text-center px-4">
      <img
        src="https://cdni.iconscout.com/illustration/premium/thumb/404-error-3702041-3119148.png"
        alt="404 Not Found"
        className="w-full max-w-lg mb-8"
      />
      <h1 className="text-5xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-6">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
      >
        Return Home
      </Link>
    </div>
  );
};

export default NotFound;
