import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-base-200 p-6 text-center">
      <h1 className="text-5xl font-bold text-base-content/30 mb-4">404</h1>
      <p className="text-xl text-base-content mb-6">Oops! Page not found.</p>
      <Link
        to="/"
        className="bg-primary text-primary-content px-6 py-2 rounded-lg hover:brightness-110 transition"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
