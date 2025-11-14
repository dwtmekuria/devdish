import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipe, deleteRecipe } from '../../store/slices/recipeSlice';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentRecipe: recipe, loading, error } = useSelector((state) => state.recipes);

  useEffect(() => {
    dispatch(fetchRecipe(id));
  }, [dispatch, id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      await dispatch(deleteRecipe(id));
      navigate('/recipes');
    }
  };

  const handleEdit = () => {
    navigate(`/recipes/edit/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading recipe...</div>
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

  if (!recipe) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recipe Not Found</h2>
        <p className="text-gray-600 mb-4">The recipe you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/recipes')} className="btn-primary">
          Back to Recipes
        </button>
      </div>
    );
  }

  const totalTime = recipe.prepTime + recipe.cookTime;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with Actions */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <button
            onClick={() => navigate('/recipes')}
            className="text-primary-600 hover:text-primary-700 font-medium mb-2"
          >
            ← Back to Recipes
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{recipe.title}</h1>
          <p className="text-gray-600 mt-2">{recipe.description}</p>
        </div>
        
        <div className="flex space-x-2">
          <button onClick={handleEdit} className="btn-secondary">
            Edit Recipe
          </button>
          <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
            Delete
          </button>
        </div>
      </div>

      {/* Recipe Image */}
      <div className="mb-8">
        <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
          {recipe.image ? (
            <img 
              src={recipe.image} 
              alt={recipe.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="text-gray-400 text-center">
              <div className="text-6xl mb-4">🍳</div>
              <p className="text-lg">No Image Available</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Recipe Info */}
        <div className="lg:col-span-1">
          {/* Recipe Meta */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Recipe Info</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Prep Time</span>
                <span className="font-medium">{recipe.prepTime} min</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Cook Time</span>
                <span className="font-medium">{recipe.cookTime} min</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Total Time</span>
                <span className="font-medium">{totalTime} min</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Servings</span>
                <span className="font-medium">{recipe.servings}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Difficulty</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                  {recipe.difficulty}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Category</span>
                <span className="font-medium">{recipe.category}</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Ingredients & Instructions */}
        <div className="lg:col-span-2">
          {/* Ingredients */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
            <ul className="space-y-3">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-primary-600 mr-3 rounded border-gray-300"
                  />
                  <span className="text-gray-900">
                    <span className="font-medium">
                      {ingredient.quantity} {ingredient.unit}
                    </span>
                    {' '}
                    {ingredient.name}
                    {ingredient.notes && (
                      <span className="text-gray-500 text-sm"> ({ingredient.notes})</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
            <ol className="space-y-6">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-4 mt-1">
                    {index + 1}
                  </span>
                  <p className="text-gray-900 leading-relaxed pt-1">{instruction}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;