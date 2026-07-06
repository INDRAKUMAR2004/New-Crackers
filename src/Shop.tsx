"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom"; // Essential for filtering
import { db } from "../../firebaseConfig";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { Loader2, SlidersHorizontal } from "lucide-react";
import ProductCard from "./ProductCard"; // Your ProductCard component

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get the category from URL (e.g., ?category=Sparklers)
  const categoryFilter = searchParams.get("category");

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prodData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(prodData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter products based on URL category
  const filteredProducts = categoryFilter
    ? products.filter((p) => p.category === categoryFilter)
    : products;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="container-custom mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {categoryFilter ? categoryFilter : "All Products"}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Showing {filteredProducts.length} items
            </p>
          </div>

          {/* Clear Filter Button (Visible only when filtering) */}
          {categoryFilter && (
            <button 
              onClick={() => setSearchParams({})} 
              className="text-sm font-medium text-orange-600 hover:underline flex items-center gap-2"
            >
              Clear Filter ✕
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
          </div>
        ) : (
          <>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                <p className="text-slate-400">No products found in this category.</p>
                <button 
                  onClick={() => setSearchParams({})}
                  className="mt-4 bg-blue-900 text-white px-6 py-2 rounded-full text-sm"
                >
                  Show All Products
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}