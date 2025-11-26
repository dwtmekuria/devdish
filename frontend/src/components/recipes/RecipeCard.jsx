import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../services/api';

const RecipeCard = ({ recipe, onDelete }) => {
  const totalTime = recipe.prepTime + recipe.cookTime;
  
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Generate image URL with cache busting
  const imageUrl = recipe._id ? getImageUrl.recipe(recipe._id) + '?t=' + Date.now() : '';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Recipe Image */}
      <div className="h-48 bg-gray-200 flex items-center justify-center relative overflow-hidden">
        {recipe._id ? (
          <img 
            src={imageUrl} 
            alt={recipe.title}
            className="h-full w-full object-cover"
            onError={(e) => {
              // Hide the image and show fallback if it fails to load
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className="text-gray-400 text-center" style={{ display: recipe._id ? 'none' : 'flex' }}>
          <div className="text-4xl mb-2">🍳</div>
          <p className="text-sm">No Image</p>
        </div>
      </div>

      {/* Recipe Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {recipe.title}
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
            {recipe.difficulty}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {recipe.description || 'No description available'}
        </p>

        {/* Recipe Meta */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              ⏱️ {totalTime}min
            </span>
            <span className="flex items-center">
              👥 {recipe.servings}
            </span>
          </div>
          <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-xs">
            {recipe.category}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <Link 
            to={`/recipes/${recipe._id}`}
            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            View Recipe
          </Link>
          
          <div className="flex space-x-2">
            <Link 
              to={`/recipes/edit/${recipe._id}`}
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              Edit
            </Link>
            <button
              onClick={() => onDelete(recipe._id)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
