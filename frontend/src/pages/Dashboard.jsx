import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Welcome back, {user?.username}!
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link 
          to="/recipes" 
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-semibold mb-2">Your Recipes</h3>
          <p className="text-gray-600">Manage your recipe collection</p>
        </Link>
        
        <Link 
          to="/recipes/new" 
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-semibold mb-2">Create Recipe</h3>
          <p className="text-gray-600">Add a new recipe to your collection</p>
        </Link>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Meal Planner</h3>
          <p className="text-gray-600">Plan your weekly meals (Coming Soon)</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;