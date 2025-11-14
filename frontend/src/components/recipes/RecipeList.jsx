import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipes, deleteRecipe, setFilters } from '../../store/slices/recipeSlice';
import RecipeCard from './RecipeCard';
import RecipeFilters from './RecipeFilters';

const RecipeList = () => {
  const dispatch = useDispatch();
  const { recipes, loading, error, filters, pagination } = useSelector((state) => state.recipes);

  useEffect(() => {
    dispatch(fetchRecipes(filters));
  }, [dispatch, filters]);

  const handleDelete = async (recipeId) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      await dispatch(deleteRecipe(recipeId));
      // Refresh the list after deletion
      dispatch(fetchRecipes(filters));
    }
  };

  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters));
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Recipes</h1>
          <p className="text-gray-600">
            {pagination.totalRecipes} recipes found
          </p>
        </div>
        <a
          href="/recipes/new"
          className="btn-primary"
        >
          + Add New Recipe
        </a>
      </div>

      {/* Filters */}
      <RecipeFilters 
        filters={filters} 
        onFilterChange={handleFilterChange} 
      />

      {/* Recipe Grid */}
      {recipes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No recipes found
          </h3>
          <p className="text-gray-600 mb-4">
            {filters.search || filters.category !== 'All' 
              ? 'Try adjusting your filters' 
              : 'Get started by creating your first recipe!'}
          </p>
          {!(filters.search || filters.category !== 'All') && (
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

          {/* Pagination - We'll implement this later */}
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