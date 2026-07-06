"use client";
import React from "react";
import { Search, Filter, X } from "lucide-react";

export default function GlassFilterBar({
    onSearch,
    searchTerm,
    categories,
    onCategorySelect,
    activeCategory,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice
}) {
    return (
        <div className="sticky top-4 z-40 mx-auto max-w-5xl px-4 animate-in slide-in-from-top duration-700">
            <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-2xl p-2 flex flex-col md:flex-row gap-2 transition-all">

                {/* Search Input */}
                <div className="relative flex-[2] group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                        <Search size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search crackers..."
                        value={searchTerm}
                        onChange={(e) => onSearch(e.target.value)}
                        className="w-full h-12 bg-slate-50/50 border-2 border-transparent pl-12 pr-10 rounded-xl outline-none text-slate-800 font-bold placeholder:text-slate-400 focus:bg-white focus:border-orange-100 focus:shadow-lg transition-all"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => onSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                {/* Category Dropdown */}
                <div className="relative flex-[1.5] group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors pointer-events-none">
                        <Filter size={20} />
                    </div>
                    <select
                        value={activeCategory}
                        onChange={(e) => onCategorySelect(e.target.value)}
                        className="w-full h-12 bg-slate-50/50 border-2 border-transparent pl-11 pr-8 rounded-xl outline-none text-slate-800 font-bold cursor-pointer focus:bg-white focus:border-orange-100 focus:shadow-lg transition-all appearance-none"
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-current"></div>
                    </div>
                </div>

                {/* Price Range Inputs */}
                <div className="flex flex-1 gap-2">
                    <input
                        type="number"
                        placeholder="Min ₹"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full h-12 bg-slate-50/50 border-2 border-transparent px-3 rounded-xl outline-none text-slate-800 font-bold placeholder:text-slate-400 focus:bg-white focus:border-orange-100 focus:shadow-lg transition-all text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <input
                        type="number"
                        placeholder="Max ₹"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full h-12 bg-slate-50/50 border-2 border-transparent px-3 rounded-xl outline-none text-slate-800 font-bold placeholder:text-slate-400 focus:bg-white focus:border-orange-100 focus:shadow-lg transition-all text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                </div>

                {/* Clear Button */}
                {(searchTerm || activeCategory || minPrice || maxPrice) && (
                    <button
                        onClick={() => {
                            onSearch("");
                            onCategorySelect("");
                            setMinPrice("");
                            setMaxPrice("");
                        }}
                        className="hidden md:flex items-center justify-center px-4 h-12 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-red-50 hover:text-red-500 transition-colors shrink-0"
                        title="Clear Filters"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>
        </div>
    );
}
