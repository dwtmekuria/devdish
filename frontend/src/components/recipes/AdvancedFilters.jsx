import React, { useState, useEffect } from 'react';
import { recipeAPI } from '../../services/recipeAPI';

const AdvancedFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const [availableTags, setAvailableTags] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    fetchUserTags();
  }, []);

  const fetchUserTags = async () => {
    try {
      const response = await recipeAPI.getUserTags();
      setAvailableTags(response.data.data.tags || []);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    }
  };

  const categories = [
    'All',
    'Breakfast',
    'Lunch',
    'Dinner',
    'Dessert',
    'Snack',
    'Beverage',
    'Other'
  ];

  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
  
  const timeRanges = [
    { label: 'Any time', value: '' },
    { label: 'Quick (≤ 15 min)', value: '15' },
    { label: 'Fast (≤ 30 min)', value: '30' },
    { label: 'Moderate (≤ 60 min)', value: '60' },
    { label: 'Lengthy (≤ 120 min)', value: '120' }
  ];

  const sortOptions = [
    { label: 'Newest First', value: 'createdAt_desc' },
    { label: 'Oldest First', value: 'createdAt_asc' },
    { label: 'Title A-Z', value: 'title_asc' },
    { label: 'Title Z-A', value: 'title_desc' },
    { label: 'Shortest Time', value: 'totalTime_asc' },
    { label: 'Longest Time', value: 'totalTime_desc' },
    { label: 'Easiest First', value: 'difficulty_asc' },
    { label: 'Hardest First', value: 'difficulty_desc' }
  ];

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handleTagToggle = (tag) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    handleFilterChange('tags', newTags);
  };

  const handleSortChange = (sortValue) => {
    const [sortBy, sortOrder] = sortValue.split('_');
    handleFilterChange('sortBy', sortBy);
    handleFilterChange('sortOrder', sortOrder);
  };

  const getCurrentSortLabel = () => {
    const currentSort = `${filters.sortBy}_${filters.sortOrder}`;
    const option = sortOptions.find(opt => opt.value === currentSort);
    return option ? option.label : 'Newest First';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filters & Sorting</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            {showAdvanced ? 'Simple View' : 'Advanced Filters'}
          </button>
          <button
            onClick={onClearFilters}
            className="text-gray-600 hover:text-gray-800 text-sm underline"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Basic Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={filters.category || 'All'}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="input-field w-full"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty
          </label>
          <select
            value={filters.difficulty || 'All'}
            onChange={(e) => handleFilterChange('difficulty', e.target.value)}
            className="input-field w-full"
          >
            {difficulties.map(diff => (
              <option key={diff} value={diff}>
                {diff}
              </option>
            ))}
          </select>
        </div>

        {/* Max Time Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Time
          </label>
          <select
            value={filters.maxTime || ''}
            onChange={(e) => handleFilterChange('maxTime', e.target.value)}
            className="input-field w-full"
          >
            {timeRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            value={`${filters.sortBy || 'createdAt'}_${filters.sortOrder || 'desc'}`}
            onChange={(e) => handleSortChange(e.target.value)}
            className="input-field w-full"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && availableTags.length > 0 && (
        <div className="border-t pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Filter by Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  (filters.tags || []).includes(tag)
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          
          {/* Active Tags Display */}
          {(filters.tags || []).length > 0 && (
            <div className="mt-3">
              <span className="text-sm text-gray-600 mr-2">Active tags:</span>
              {(filters.tags || []).map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-800 mr-2"
                >
                  {tag}
                  <button
                    onClick={() => handleTagToggle(tag)}
                    className="ml-1 text-primary-600 hover:text-primary-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Active Filters Summary */}
      <div className="border-t pt-4 mt-4">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-gray-600">Active filters:</span>
          
          {filters.category && filters.category !== 'All' && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              Category: {filters.category}
            </span>
          )}
          
          {filters.difficulty && filters.difficulty !== 'All' && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
              Difficulty: {filters.difficulty}
            </span>
          )}
          
          {filters.maxTime && (
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
              Max Time: {timeRanges.find(t => t.value === filters.maxTime)?.label}
            </span>
          )}
          
          {filters.search && (
            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
              Search: "{filters.search}"
            </span>
          )}
          
          {(!filters.category || filters.category === 'All') && 
           (!filters.difficulty || filters.difficulty === 'All') && 
           !filters.maxTime && 
           !filters.search && 
           (!filters.tags || filters.tags.length === 0) && (
            <span className="text-gray-500">No active filters</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;