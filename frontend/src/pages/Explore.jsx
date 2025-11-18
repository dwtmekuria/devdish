import React, { useState, useEffect } from 'react';
import { publicAPI } from '../services/publicAPI';
import PublicRecipeCard from '../components/public/PublicRecipeCard';
import SearchBar from '../components/recipes/SearchBar';

const Explore = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  useEffect(() => {
    fetchPublicRecipes();
  }, [filters]);

  const fetchPublicRecipes = async () => {
    try {
      setLoading(true);
      const response = await publicAPI.getPublicRecipes(filters);
      setRecipes(response.data.data.recipes);
    } catch (error) {
      setError('Failed to load public recipes');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  };

  const handleLike = async (recipeId) => {
    // Implement like functionality
    console.log('Liking recipe:', recipeId);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading recipes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Recipes</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover amazing recipes shared by the DevDish community. 
            Find inspiration for your next meal!
          </p>
        </div>

        {/* Search */}
        <div className="flex justify-center">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Recipes Grid */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {recipes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No recipes found
            </h3>
            <p className="text-gray-600">
              {filters.search 
                ? `No recipes found for "${filters.search}"` 
                : 'No public recipes available yet.'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <PublicRecipeCard 
                key={recipe._id} 
                recipe={recipe} 
                onLike={handleLike}
                showLikeButton={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;