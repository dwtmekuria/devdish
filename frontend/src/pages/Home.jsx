import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Welcome to DevDish
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Your personal recipe manager. Organize, discover, and create amazing dishes 
        with our intuitive cooking companion.
      </p>
      
      {isAuthenticated ? (
        <Link to="/dashboard" className="btn-primary text-lg px-8 py-3">
          Go to Dashboard
        </Link>
      ) : (
        <div className="space-x-4">
          <Link to="/register" className="btn-primary text-lg px-8 py-3">
            Get Started
          </Link>
          <Link to="/login" className="btn-secondary text-lg px-8 py-3">
            Login
          </Link>
        </div>
      )}
      
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Organize Recipes</h3>
          <p className="text-gray-600">Keep all your favorite recipes in one place</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Meal Planning</h3>
          <p className="text-gray-600">Plan your meals and generate shopping lists</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Share & Discover</h3>
          <p className="text-gray-600">Share your creations with the community</p>
        </div>
      </div>
    </div>
  );
};

export default Home;