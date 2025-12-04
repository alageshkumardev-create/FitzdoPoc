import React, { useState, useEffect } from 'react';

export default function SearchBar({ value, onChange, placeholder = "Search for products..." }) {
  const [inputValue, setInputValue] = useState(value);

  // Debounce the search query
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onChange(inputValue);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [inputValue, onChange]);

  // Sync with external value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fitzdo-orange focus:border-transparent"
      />
      <svg
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
}
