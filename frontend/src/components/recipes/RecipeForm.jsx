import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createRecipe, updateRecipe, clearCurrentRecipe } from '../../store/slices/recipeSlice';
import { useNavigate } from 'react-router-dom';
import ImageUpload from './ImageUpload';
import { getImageUrl } from '../../services/api';
import {uploadAPI} from '../../services/uploadAPI';

const RecipeForm = ({ recipe = null }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.recipes);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: [{ name: '', quantity: '', unit: 'g' }],
    instructions: [''],
    prepTime: '',
    cookTime: '',
    servings: '',
    difficulty: 'Medium',
    category: 'Other',
    tags: [],
    isPublic: false,
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [newTag, setNewTag] = useState('');

  const units = ['g', 'kg', 'ml', 'l', 'cup', 'tbsp', 'tsp', 'piece', 'pinch', 'to taste'];
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Beverage', 'Other'];

  const handleImageUpload = (imageFile) => {
    if (imageFile && typeof imageFile === 'object') {
      // It's a File object for new recipe
      setSelectedImage(imageFile);
    } else if (imageFile && recipe) {
      // Image was uploaded for existing recipe
      setImagePreview(getImageUrl.recipe(recipe._id) + '?t=' + Date.now());
    } else if (imageFile === null) {
      // Image was removed
      setSelectedImage(null);
      setImagePreview('');
    }
  };

  useEffect(() => {
    if (recipe) {
      setFormData({
        title: recipe.title || '',
        description: recipe.description || '',
        ingredients: recipe.ingredients.length > 0 ? recipe.ingredients : [{ name: '', quantity: '', unit: 'g' }],
        instructions: recipe.instructions.length > 0 ? recipe.instructions : [''],
        prepTime: recipe.prepTime || '',
        cookTime: recipe.cookTime || '',
        servings: recipe.servings || '',
        difficulty: recipe.difficulty || 'Medium',
        category: recipe.category || 'Other',
        tags: recipe.tags || [],
        isPublic: recipe.isPublic || false
      });
      
      // Set existing image preview if available
      if (recipe._id) {
        setImagePreview(getImageUrl.recipe(recipe._id));
      }
    }
  }, [recipe]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      [field]: value
    };
    setFormData(prev => ({ ...prev, ingredients: updatedIngredients }));
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', quantity: '', unit: 'g' }]
    }));
  };

  const removeIngredient = (index) => {
    if (formData.ingredients.length > 1) {
      setFormData(prev => ({
        ...prev,
        ingredients: prev.ingredients.filter((_, i) => i !== index)
      }));
    }
  };

  const handleInstructionChange = (index, value) => {
    const updatedInstructions = [...formData.instructions];
    updatedInstructions[index] = value;
    setFormData(prev => ({ ...prev, instructions: updatedInstructions }));
  };

  const addInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };

  const removeInstruction = (index) => {
    if (formData.instructions.length > 1) {
      setFormData(prev => ({
        ...prev,
        instructions: prev.instructions.filter((_, i) => i !== index)
      }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validate required fields
  if (!formData.title.trim()) {
    alert('Recipe title is required');
    return;
  }
  if (!formData.prepTime || formData.prepTime < 0) {
    alert('Prep time is required and must be a positive number');
    return;
  }
  if (!formData.cookTime || formData.cookTime < 0) {
    alert('Cook time is required and must be a positive number');
    return;
  }
  if (!formData.servings || formData.servings < 1) {
    alert('Servings is required and must be at least 1');
    return;
  }
  if (formData.ingredients.some(ing => !ing.name.trim() || ing.quantity === '')) {
    alert('All ingredients must have a name and quantity');
    return;
  }
  if (formData.instructions.some(instruction => !instruction.trim())) {
    alert('All instruction steps must be filled');
    return;
  }

  // Prepare recipe data as JSON
  const recipeData = {
    title: formData.title.trim(),
    description: formData.description.trim(),
    ingredients: formData.ingredients.map(ing => ({
      name: ing.name.trim(),
      quantity: parseFloat(ing.quantity) || 0,
      unit: ing.unit
    })),
    instructions: formData.instructions.map(inst => inst.trim()),
    prepTime: parseInt(formData.prepTime) || 0,
    cookTime: parseInt(formData.cookTime) || 0,
    servings: parseInt(formData.servings) || 1,
    difficulty: formData.difficulty,
    category: formData.category,
    tags: formData.tags,
    isPublic: formData.isPublic
  };

  try {
    if (recipe) {
      await dispatch(updateRecipe({ 
        id: recipe._id, 
        recipeData 
      })).unwrap();
      
      // If there's a new image, upload it separately
      if (selectedImage) {
        const imageFormData = new FormData();
        imageFormData.append('image', selectedImage);
        imageFormData.append('recipeId', recipe._id);
        await uploadAPI.uploadImage(imageFormData, recipe._id);
      }
    } else {
      const newRecipe = await dispatch(createRecipe(recipeData)).unwrap();
      
      // If there's an image, upload it separately after creating the recipe
      if (selectedImage) {
        const imageFormData = new FormData();
        imageFormData.append('image', selectedImage);
        imageFormData.append('recipeId', newRecipe._id);
        await uploadAPI.uploadImage(imageFormData, newRecipe._id);
      }
    }
    
    dispatch(clearCurrentRecipe());
    navigate('/dashboard');
  } catch (error) {
    console.error('Failed to save recipe:', error);
    alert('Failed to save recipe. Please check all required fields and try again.');
  }
};

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {recipe ? 'Edit Recipe' : 'Create New Recipe'}
      </h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <ImageUpload 
            onImageUpload={handleImageUpload}
            currentImage={imagePreview}
            recipeId={recipe?._id}
          />
        </div>

        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipe Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="input-field"
                required
                placeholder="Enter recipe title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="input-field"
                required
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="input-field"
              placeholder="Describe your recipe..."
            />
          </div>
        </div>

        {/* Timing & Details */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Timing & Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prep Time (min) *
              </label>
              <input
                type="number"
                name="prepTime"
                value={formData.prepTime}
                onChange={handleInputChange}
                className="input-field"
                min="0"
                required
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cook Time (min) *
              </label>
              <input
                type="number"
                name="cookTime"
                value={formData.cookTime}
                onChange={handleInputChange}
                className="input-field"
                min="0"
                required
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Servings *
              </label>
              <input
                type="number"
                name="servings"
                value={formData.servings}
                onChange={handleInputChange}
                className="input-field"
                min="1"
                required
                placeholder="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty *
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                className="input-field"
                required
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Ingredients *</h2>
            <button
              type="button"
              onClick={addIngredient}
              className="btn-secondary text-sm"
            >
              + Add Ingredient
            </button>
          </div>

          <div className="space-y-3">
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="flex space-x-3 items-start">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Ingredient name *"
                    value={ingredient.name}
                    onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                    className="input-field"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Quantity *"
                    value={ingredient.quantity}
                    onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                    className="input-field"
                    step="0.1"
                    min="0"
                    required
                  />
                  <select
                    value={ingredient.unit}
                    onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                    className="input-field"
                    required
                  >
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="text-red-600 hover:text-red-800 mt-2"
                  disabled={formData.ingredients.length === 1}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Instructions *</h2>
            <button
              type="button"
              onClick={addInstruction}
              className="btn-secondary text-sm"
            >
              + Add Step
            </button>
          </div>

          <div className="space-y-3">
            {formData.instructions.map((instruction, index) => (
              <div key={index} className="flex space-x-3">
                <span className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-medium mt-1">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <textarea
                    placeholder={`Step ${index + 1}... *`}
                    value={instruction}
                    onChange={(e) => handleInstructionChange(index, e.target.value)}
                    rows="2"
                    className="input-field"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeInstruction(index)}
                  className="text-red-600 hover:text-red-800 mt-2"
                  disabled={formData.instructions.length === 1}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Tags & Settings */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Tags & Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  placeholder="Add a tag (e.g., vegetarian, quick)"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="input-field flex-1"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="btn-secondary"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-primary-600 hover:text-primary-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Make this recipe public
              </label>
            </div>
            
            {formData.isPublic && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  ✅ This recipe will be visible to everyone on the Explore page. 
                  Other users will be able to view and like your creation!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? 'Saving...' : (recipe ? 'Update Recipe' : 'Create Recipe')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecipeForm;