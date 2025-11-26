import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { userAPI } from '../../services/userAPI';
import PublicRecipeCard from '../public/PublicRecipeCard';
import { getImageUrl } from '../../services/api';

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Generate avatar URL
  const avatarUrl = userId ? getImageUrl.avatar(userId) : '';

  useEffect(() => {
    fetchUserProfile();
    fetchUserRecipes();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const response = await userAPI.getUserProfile(userId);
      setUser(response.data.data.user);
    } catch (error) {
      setError('Failed to load user profile');
    }
  };

  const fetchUserRecipes = async () => {
    try {
      const response = await userAPI.getUserRecipes(userId);
      setRecipes(response.data.data.recipes);
    } catch (error) {
      console.error('Failed to load user recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Link to="/explore" className="btn-primary">
          Browse Recipes
        </Link>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border p-8 mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          {/* Avatar */}
          <div className="shrink-0">
            {userId ? (
              <img 
                src={avatarUrl} 
                alt={user.username}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                onError={(e) => {
                  // Fallback to initial if image fails to load
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : 
            <div className="w-24 h-24 bg-primary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-md">
              {user.username?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            }
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {user.username}
            </h1>
            
            {user.bio && (
              <p className="text-gray-600 mb-4 max-w-2xl">
                {user.bio}
              </p>
            )}

            {/* User Stats */}
            <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">
                  {user.stats?.publicRecipes || 0}
                </div>
                <div className="text-sm text-gray-600">Recipes Shared</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-700">
                  {user.stats?.totalRecipes || 0}
                </div>
                <div className="text-sm text-gray-600">Total Recipes</div>
              </div>
            </div>

            {/* User Details */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {user.location && (
                <span className="flex items-center">
                  📍 {user.location}
                </span>
              )}
              
              {user.website && (
                <a 
                  href={user.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-primary-600 hover:text-primary-700"
                >
                  🌐 {user.website.replace(/^https?:\/\//, '')}
                </a>
              )}
              
              {user.socialMedia?.twitter && (
                <a 
                  href={`https://twitter.com/${user.socialMedia.twitter}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  🐦 @{user.socialMedia.twitter}
                </a>
              )}
              {user.socialMedia?.instagram && (
                <a 
                  href={`https://instagram.com/${user.socialMedia.instagram}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-pink-600 hover:text-pink-700"
                >
                  📸 @{user.socialMedia.instagram}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* User's Recipes */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Recipes by {user.username}
        </h2>

        {recipes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <div className="text-6xl mb-4">🍳</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No recipes yet
            </h3>
            <p className="text-gray-600">
              {user.username} hasn't shared any recipes publicly yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <PublicRecipeCard 
                key={recipe._id} 
                recipe={recipe}
                showLikeButton={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;