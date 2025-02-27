import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-semibold text-gray-800 mb-4">404 - Page Not Found</h1>
        <p className="text-gray-600 mb-4">The page you are looking for does not exist.</p>
        <Link to="/" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;