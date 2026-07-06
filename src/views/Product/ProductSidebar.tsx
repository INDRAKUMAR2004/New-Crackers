"use client";
import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function ProductSidebar({
  categories,
  selectedCategories,
  onCategoryChange,
  products,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  inStockOnly,
  setInStockOnly,
  outOfStockOnly,
  setOutOfStockOnly,
}) {
  const [catSearch, setCatSearch] = useState('');

  const getCategoryCount = (catName) => {
    return products.filter((p) => (p.category || 'Others') === catName).length;
  };

  const filteredCategories = categories.filter((cat) =>
    cat.toLowerCase().includes(catSearch.toLowerCase())
  );

  return (
    <div className="w-full bg-white rounded border border-gray-200 p-4 sticky top-4">
      {/* CATEGORIES */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide border-b border-gray-100 pb-2">Category</h3>
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="Search categories..."
            value={catSearch}
            onChange={(e) => setCatSearch(e.target.value)}
            className="w-full h-8 border border-gray-300 rounded pl-8 pr-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-500"
          />
          <Search
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
            size={12}
          />
        </div>
        <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1">
          {filteredCategories.map((cat) => (
            <label
              key={cat}
              className="flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 border-gray-300 rounded-sm text-gray-900 focus:ring-0 cursor-pointer"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => onCategoryChange(cat)}
                />
                <span className={`text-sm ${selectedCategories.includes(cat) ? 'text-gray-900 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>
                  {cat}
                </span>
              </div>
              <span className="text-xs text-gray-400">
                ({getCategoryCount(cat)})
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* AVAILABILITY */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide border-b border-gray-100 pb-2">Availability</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              className="w-3.5 h-3.5 border-gray-300 rounded-sm text-gray-900 focus:ring-0 cursor-pointer"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
            />
            <span className={`text-sm ${inStockOnly ? 'text-gray-900 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>
              In Stock
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              className="w-3.5 h-3.5 border-gray-300 rounded-sm text-gray-900 focus:ring-0 cursor-pointer"
              checked={outOfStockOnly}
              onChange={(e) => setOutOfStockOnly(e.target.checked)}
            />
            <span className={`text-sm ${outOfStockOnly ? 'text-gray-900 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>
              Out of Stock
            </span>
          </label>
        </div>
      </div>

      {/* PRICE RANGE */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide border-b border-gray-100 pb-2">Price</h3>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
              ₹
            </span>
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full h-8 border border-gray-300 rounded pl-6 pr-2 text-sm text-gray-800 focus:outline-none focus:border-gray-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <span className="text-gray-400 text-xs">-</span>
          <div className="relative flex-1">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
              ₹
            </span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full h-8 border border-gray-300 rounded pl-6 pr-2 text-sm text-gray-800 focus:outline-none focus:border-gray-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
