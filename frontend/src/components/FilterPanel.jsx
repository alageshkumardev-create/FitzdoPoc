import React from 'react';

export default function FilterPanel({ filters, onFilterChange }) {
  const categories = [
    'Fitness Equipment',
    'Weights',
    'Cardio',
    'Supplements',
    'Yoga & Pilates',
    'Accessories',
    'Resistance Training',
    'Functional Training',
    'Recovery',
    'Apparel',
    'Footwear'
  ];

  const handleCategoryToggle = (category) => {
    const currentCategories = filters.categories || [];
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category];

    onFilterChange({ ...filters, categories: newCategories });
  };

  const handlePriceChange = (field, value) => {
    onFilterChange({
      ...filters,
      [field]: value ? parseFloat(value) : 0
    });
  };

  const handleRatingChange = (rating) => {
    onFilterChange({ ...filters, minRating: rating });
  };

  const handleSponsoredToggle = () => {
    onFilterChange({ ...filters, sponsored: !filters.sponsored });
  };

  const clearFilters = () => {
    onFilterChange({
      categories: [],
      minPrice: 0,
      maxPrice: 999999,
      minRating: 0,
      sponsored: false
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-fitzdo-orange hover:text-fitzdo-orange-dark"
        >
          Clear All
        </button>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {categories.map((category) => (
            <label key={category} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
              <input
                type="checkbox"
                checked={filters.categories?.includes(category) || false}
                onChange={() => handleCategoryToggle(category)}
                className="w-4 h-4 text-fitzdo-orange focus:ring-fitzdo-orange border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Min Price</label>
            <input
              type="number"
              value={filters.minPrice || 0}
              onChange={(e) => handlePriceChange('minPrice', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-fitzdo-orange"
              placeholder="₹0"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Max Price</label>
            <input
              type="number"
              value={filters.maxPrice === 999999 ? '' : filters.maxPrice}
              onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-fitzdo-orange"
              placeholder="Any"
            />
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Minimum Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === rating}
                onChange={() => handleRatingChange(rating)}
                className="w-4 h-4 text-fitzdo-orange focus:ring-fitzdo-orange border-gray-300"
              />
              <div className="flex items-center gap-1">
                {[...Array(rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
                {[...Array(5 - rating)].map((_, i) => (
                  <span key={i} className="text-gray-300">★</span>
                ))}
                <span className="text-sm text-gray-700 ml-1">& Up</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Sponsored */}
      <div className="mb-4">
        <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
          <input
            type="checkbox"
            checked={filters.sponsored || false}
            onChange={handleSponsoredToggle}
            className="w-4 h-4 text-fitzdo-orange focus:ring-fitzdo-orange border-gray-300 rounded"
          />
          <span className="text-sm font-medium text-gray-700">Fitzdo Sponsored Only</span>
        </label>
      </div>
    </div>
  );
}
