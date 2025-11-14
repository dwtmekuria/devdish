import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipe, clearCurrentRecipe } from '../store/slices/recipeSlice';
import RecipeForm from '../components/recipes/RecipeForm';

const EditRecipe = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentRecipe, loading } = useSelector((state) => state.recipes);

  useEffect(() => {
    dispatch(fetchRecipe(id));
    
    return () => {
      dispatch(clearCurrentRecipe());
    };
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading recipe...</div>
        </div>
      </div>
    );
  }

  if (!currentRecipe) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Recipe Not Found</h1>
          <p className="text-gray-600">The recipe you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <RecipeForm recipe={currentRecipe} />
    </div>
  );
};

export default EditRecipe;