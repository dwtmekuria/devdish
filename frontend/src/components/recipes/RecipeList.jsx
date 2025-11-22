import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipes, deleteRecipe, setFilters } from '../../store/slices/recipeSlice';
import RecipeCard from './RecipeCard';
import RecipeFilters from './RecipeFilters';
import AdvancedFilters from './AdvancedFilters';
import SearchBar from './SearchBar';

const RecipeList = () => {
  const dispatch = useDispatch();
  const { recipes, loading, error, filters, pagination } = useSelector((state) => state.recipes);
  
  const [enhancedFilters, setEnhancedFilters] = useState({
    category: 'All',
    search: '',
    difficulty: 'All',
    maxTime: '',
    tags: [],
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    dispatch(fetchRecipes(enhancedFilters));
  }, [dispatch, enhancedFilters]);

  const handleDelete = async (recipeId) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      await dispatch(deleteRecipe(recipeId));
      dispatch(fetchRecipes(enhancedFilters));
    }
  };

  const handleSearch = (searchTerm, searchType = 'all') => {
    setEnhancedFilters(prev => ({
      ...prev,
      search: searchTerm
    }));
  };

  const handleFilterChange = (newFilters) => {
    setEnhancedFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handleClearFilters = () => {
    setEnhancedFilters({
      category: 'All',
      search: '',
      difficulty: 'All',
      maxTime: '',
      tags: [],
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading recipes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Recipes</h1>
          <p className="text-gray-600">
            {pagination.totalRecipes} recipes found
            {enhancedFilters.search && ` for "${enhancedFilters.search}"`}
          </p>
        </div>
        <div className="flex space-x-4">
          <a
            href="/recipes/new"
            className="btn-primary"
          >
            + Add New Recipe
          </a>
        </div>
      </div>

      {/* Search Bar with Toggle Button */}
      <div className="flex justify-center items-center space-x-4">
        <SearchBar 
          onSearch={handleSearch}
          initialValue={enhancedFilters.search}
        />
        <button
          onClick={toggleFilters}
          className="flex self-baseline h-10.5 space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          <span className="text-sm font-medium text-gray-700">
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </span>
          <svg 
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
              showFilters ? 'rotate-180' : ''
            }`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Advanced Filters with Toggle */}
      {showFilters && (
        <AdvancedFilters 
          filters={enhancedFilters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      )}

      {/* Recipe Grid */}
      {recipes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No recipes found
          </h3>
          <p className="text-gray-600 mb-4">
            {enhancedFilters.search || enhancedFilters.category !== 'All' 
              ? 'Try adjusting your filters' 
              : 'Get started by creating your first recipe!'}
          </p>
          {!(enhancedFilters.search || enhancedFilters.category !== 'All') && (
            <a href="/recipes/new" className="btn-primary">
              Create Your First Recipe
            </a>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard 
                key={recipe._id} 
                recipe={recipe} 
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex space-x-2">
                <button className="btn-secondary">Previous</button>
                <span className="px-4 py-2 text-gray-700">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button className="btn-secondary">Next</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RecipeList;