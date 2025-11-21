import React from 'react';
import { Link } from 'react-router-dom';

const PublicRecipeCard = ({ recipe, onLike, isLiked = false, showLikeButton = true }) => {
  const totalTime = recipe.prepTime + recipe.cookTime;
  
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLikeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onLike) {
      onLike(recipe._id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Recipe Image */}
      <div className="h-48 bg-gray-200 flex items-center justify-center relative">
        {recipe.image ? (
          <img 
            src={recipe.image} 
            alt={recipe.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="text-gray-400 text-center">
            <div className="text-4xl mb-2">🍳</div>
            <p className="text-sm">No Image</p>
          </div>
        )}
        
        {/* Like Button */}
        {showLikeButton && (
          <button
            onClick={handleLikeClick}
            className={`absolute top-2 right-2 p-2 rounded-full ${
              isLiked 
                ? 'bg-red-500 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <svg 
              className="w-5 h-5" 
              fill={isLiked ? "currentColor" : "none"} 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        )}
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
            {recipe.views > 0 && (
              <span className="flex items-center">
                👁️ {recipe.views}
              </span>
            )}
          </div>
          <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-xs">
            {recipe.category}
          </span>
        </div>

        {/* User Info & Actions */}
        <div className="flex justify-between items-center">
          <Link 
            to={`/user/${recipe.userId?._id || recipe.userId}`}
            className="flex items-center space-x-2 hover:underline"
          >
            {recipe.userId?.avatar ? (
              <img 
                src={recipe.userId.avatar} 
                alt={recipe.userId.username}
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                {recipe.userId?.username?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
            <span className="text-sm text-gray-600">
              {recipe.userId?.username || 'Unknown'}
            </span>
          </Link>
          
          <Link 
            to={`/recipe/${recipe.publicId}`}
            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            View Recipe
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PublicRecipeCard;