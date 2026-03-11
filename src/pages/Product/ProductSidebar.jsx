import React, { useState } from 'react';
import { Search, Check, Filter } from 'lucide-react';

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
    <div className="w-full space-y-6 p-5 bg-white rounded-xl border border-gray-100 sticky top-20">
      <div className="flex items-center gap-2 text-gray-400 uppercase tracking-wider text-[10px] font-semibold">
        <Filter size={12} />
        <span>Filters</span>
      </div>

      {/* CATEGORIES */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">Categories</h3>
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="Search..."
            value={catSearch}
            onChange={(e) => setCatSearch(e.target.value)}
            className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-3 text-xs text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
          />
          <Search
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
            size={14}
          />
        </div>
        <div className="space-y-0.5 max-h-[260px] overflow-y-auto">
          {filteredCategories.map((cat) => (
            <label
              key={cat}
              className="flex items-center justify-between cursor-pointer py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    selectedCategories.includes(cat)
                      ? 'bg-accent border-accent text-white'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {selectedCategories.includes(cat) && (
                    <Check size={10} strokeWidth={3} />
                  )}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => onCategoryChange(cat)}
                />
                <span
                  className={`text-xs ${selectedCategories.includes(cat) ? 'text-gray-900 font-semibold' : 'text-gray-600'}`}
                >
                  {cat}
                </span>
              </div>
              <span className="text-[10px] text-gray-400 font-medium">
                {getCategoryCount(cat)}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-gray-100 w-full" />

      {/* AVAILABILITY */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">Availability</h3>
        <div className="space-y-0.5">
          <label className="flex items-center justify-between cursor-pointer py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  inStockOnly
                    ? 'bg-accent border-accent text-white'
                    : 'border-gray-300 bg-white'
                }`}
              >
                {inStockOnly && <Check size={10} strokeWidth={3} />}
              </div>
              <input
                type="checkbox"
                className="hidden"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
              />
              <span
                className={`text-xs ${inStockOnly ? 'text-gray-900 font-semibold' : 'text-gray-600'}`}
              >
                In Stock
              </span>
            </div>
            <span className="text-[10px] text-gray-400 font-medium">
              {products.filter((p) => p.stock > 0).length}
            </span>
          </label>
          <label className="flex items-center justify-between cursor-pointer py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  outOfStockOnly
                    ? 'bg-accent border-accent text-white'
                    : 'border-gray-300 bg-white'
                }`}
              >
                {outOfStockOnly && <Check size={10} strokeWidth={3} />}
              </div>
              <input
                type="checkbox"
                className="hidden"
                checked={outOfStockOnly}
                onChange={(e) => setOutOfStockOnly(e.target.checked)}
              />
              <span
                className={`text-xs ${outOfStockOnly ? 'text-gray-900 font-semibold' : 'text-gray-600'}`}
              >
                Out of Stock
              </span>
            </div>
            <span className="text-[10px] text-gray-400 font-medium">
              {products.filter((p) => !p.stock || p.stock <= 0).length}
            </span>
          </label>
        </div>
      </div>

      <div className="h-px bg-gray-100 w-full" />

      {/* PRICE RANGE */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">Price Range</h3>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
              ₹
            </span>
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg pl-6 pr-2 text-xs text-gray-700 text-center focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <span className="text-gray-300 text-xs">–</span>
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
              ₹
            </span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg pl-6 pr-2 text-xs text-gray-700 text-center focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
