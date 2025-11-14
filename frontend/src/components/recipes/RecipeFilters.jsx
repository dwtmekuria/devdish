import React, { useState } from 'react';

const RecipeFilters = ({ filters, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onFilterChange({ ...filters, search: searchTerm });
  };

  const handleCategoryChange = (category) => {
    onFilterChange({ ...filters, category });
  };

  const clearFilters = () => {
    setSearchTerm('');
    onFilterChange({ category: 'All', search: '' });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        {/* Search Form */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="input-field flex-1"
            />
            <button type="submit" className="btn-primary">
              Search
            </button>
          </div>
        </form>

        {/* Category Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Category:</span>
          <select
            value={filters.category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="input-field"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        {(filters.search || filters.category !== 'All') && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-600 hover:text-gray-800 underline"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default RecipeFilters;