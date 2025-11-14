import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import RecipeStats from '../components/dashboard/RecipeStats';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-gray-600">Manage your recipes and plan your meals</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link 
            to="/recipes" 
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary-200"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <span className="text-primary-600 text-xl">📚</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Your Recipes</h3>
                <p className="text-gray-600 text-sm">Manage your recipe collection</p>
              </div>
            </div>
          </Link>
          
          <Link 
            to="/recipes/new" 
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary-200"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-xl">➕</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Create Recipe</h3>
                <p className="text-gray-600 text-sm">Add a new recipe to your collection</p>
              </div>
            </div>
          </Link>
          
          <div className="bg-white p-6 rounded-lg shadow-md border-2 border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-xl">📅</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Meal Planner</h3>
                <p className="text-gray-600 text-sm">Plan your weekly meals (Coming Soon)</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border-2 border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-xl">🛒</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Shopping List</h3>
                <p className="text-gray-600 text-sm">Generate shopping lists (Coming Soon)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="lg:col-span-1">
          <RecipeStats />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;