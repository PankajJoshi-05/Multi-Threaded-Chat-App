import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-6 text-center">
      <h1 className="text-5xl font-bold text-[#B5B4BC] mb-4">404</h1>
      <p className="text-xl text-gray-700 mb-6">Oops! Page not found.</p>
      <Link
        to="/"
        className="bg-[#2ba071] text-white px-6 py-2 rounded-lg hover:bg-[#58cc9e] transition"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
