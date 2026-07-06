"use client";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trash2,
  Pencil,
  Search,
  Plus,
  Filter,
  Package,
  ShoppingBag,
  Sparkles,
  Tag,
  Zap,
  ArrowUpRight,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  ArrowUpDown
} from 'lucide-react';
import { doc, deleteDoc, updateDoc, collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useProducts } from './ProductContext';
import toast from 'react-hot-toast';

const ProductsList = () => {
  const navigate = useNavigate();
  const { products, loading, deleteProduct } = useProducts();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'categories'), (snap) => {
      let docs = snap.docs.map((d) => d.data());
      docs.sort((a, b) => (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0));
      setCategories(docs.map(d => d.name));
    });
    return () => unsub();
  }, []);

  const handleEdit = (product) => {
    navigate(`/admin/add-product?edit=${product.id}`);
  };

  const handleDelete = async (id) => {
    toast(
      (t) => (
        <div className="flex items-center gap-3">
          <span className="text-sm">Delete this product?</span>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const result = await deleteProduct(id);
                if (result?.success) {
                  toast.success('Product deleted');
                } else {
                  toast.error(result?.message || 'Failed to delete product');
                }
              } catch (error) {
                console.error('Delete error:', error);
                toast.error(error?.message || 'Failed to delete product');
              }
            }}
            className="px-3 py-1 bg-red-500 text-white rounded text-xs font-medium"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-gray-200 rounded text-xs font-medium"
          >
            Cancel
          </button>
        </div>
      ),
      { duration: 10000 }
    );
  };

  const handleSortProduct = async (product, direction) => {
    // Get all products in the SAME category, sorted by their current sortOrder
    const categoryProducts = products
      .filter(p => p.category === product.category)
      .sort((a, b) => (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0));

    const currentIndex = categoryProducts.findIndex(p => p.id === product.id);
    if (currentIndex === -1) return;

    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === categoryProducts.length - 1) return;

    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    try {
      // Re-assign strict sequential sortOrder to all products in this category
      const newArray = [...categoryProducts];
      [newArray[currentIndex], newArray[swapIndex]] = [newArray[swapIndex], newArray[currentIndex]];

      await Promise.all(
        newArray.map((p, i) => updateDoc(doc(db, 'products', p.id), { sortOrder: i }))
      );
    } catch (e) {
      console.error(e);
      toast.error('Failed to sort products');
    }
  };

  const handleToggleVisibility = async (product) => {
    try {
      const newHideStatus = !product.hideProduct;
      await updateDoc(doc(db, 'products', product.id), {
        hideProduct: newHideStatus
      });
      toast.success(newHideStatus ? 'Product disabled (hidden)' : 'Product enabled (visible)');
    } catch (err) {
      toast.error('Failed to update product visibility');
    }
  };

  const filteredProducts = products.filter((p) => {
    const byCategory = selectedCategory
      ? p.category === selectedCategory
      : true;
    const bySearch = searchText
      ? p.name.toLowerCase().includes(searchText.toLowerCase()) ||
      p.productCode?.toLowerCase().includes(searchText.toLowerCase())
      : true;
    return byCategory && bySearch;
  }).sort((a, b) => {
    if (sortBy === 'name-a-z') return (a.name || '').localeCompare(b.name || '');
    if (sortBy === 'name-z-a') return (b.name || '').localeCompare(a.name || '');
    if (sortBy === 'price-low-high') return (Number(a.price) || 0) - (Number(b.price) || 0);
    if (sortBy === 'price-high-low') return (Number(b.price) || 0) - (Number(a.price) || 0);

    const catCompare = (a.category || '').localeCompare(b.category || '');
    if (catCompare !== 0) return catCompare;
    return (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0);
  });

  return (
    <div className="space-y-5 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-[#172b4d]">Products</h1>
          <p className="text-[13px] text-[#6b778c] mt-0.5">
            {products.length} items &middot; {categories.length} categories
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/add-product')}
          className="flex items-center gap-1.5 bg-[#0078d4] text-white px-4 py-2 rounded text-[13px] font-medium hover:bg-[#106ebe] transition-colors"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-[#dfe1e6] p-3 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a5adba]"
          />
          <input
            type="text"
            placeholder="Search products..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-[13px] bg-[#fafbfc] border border-[#dfe1e6] rounded text-[#172b4d] placeholder-[#a5adba] outline-none focus:border-[#0078d4] focus:ring-2 focus:ring-[#0078d4]/20 transition-all"
          />
        </div>
        <div className="relative">
          <Filter
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a5adba] pointer-events-none"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-9 pr-8 py-2 text-[13px] bg-[#fafbfc] border border-[#dfe1e6] rounded text-[#42526e] outline-none focus:border-[#0078d4] cursor-pointer appearance-none min-w-[180px]"
          >
            <option value="">All Categories</option>
            {categories.map((c, idx) => (
              <option key={idx} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="relative">
          <ArrowUpDown
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a5adba] pointer-events-none"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="pl-9 pr-8 py-2 text-[13px] bg-[#fafbfc] border border-[#dfe1e6] rounded text-[#42526e] outline-none focus:border-[#0078d4] cursor-pointer appearance-none min-w-[160px]"
          >
            <option value="default">Default Sort</option>
            <option value="name-a-z">Name (A-Z)</option>
            <option value="name-z-a">Name (Z-A)</option>
            <option value="price-low-high">Price (Low-High)</option>
            <option value="price-high-low">Price (High-Low)</option>
          </select>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-[#0078d4] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[13px] text-[#6b778c]">Loading products...</p>
          </div>
        </div>
      )}

      {/* Products Table */}
      {!loading && filteredProducts.length > 0 && (
        <div className="bg-white rounded-lg border border-[#dfe1e6] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#fafbfc] text-[11px] font-semibold text-[#6b778c] uppercase tracking-wide border-b border-[#dfe1e6]">
                <tr>
                  <th className="px-2 sm:px-5 py-3">Product</th>
                  <th className="px-2 sm:px-4 py-3 hidden md:table-cell">Sort</th>
                  <th className="px-2 sm:px-4 py-3 hidden md:table-cell">SKU</th>
                  <th className="px-2 sm:px-4 py-3 hidden md:table-cell">Category</th>
                  <th className="px-2 sm:px-4 py-3 text-right hidden sm:table-cell">MRP</th>
                  <th className="px-2 sm:px-4 py-3 text-right">Price</th>
                  <th className="px-2 sm:px-4 py-3 text-center hidden sm:table-cell">Status</th>
                  <th className="px-2 sm:px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f4f5f7]">
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-[#fafbfc] transition-colors"
                  >
                    <td className="px-2 sm:px-5 py-3">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded bg-[#f4f5f7] overflow-hidden shrink-0 border border-[#dfe1e6]">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#a5adba]">
                              <Package size={16} />
                            </div>
                          )}
                        </div>
                        <span className="text-[12px] sm:text-[13px] font-medium text-[#172b4d] line-clamp-2 sm:line-clamp-1 break-words">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex flex-col gap-1 w-6">
                        <button
                          onClick={() => handleSortProduct(product, 'up')}
                          className="text-[#a5adba] hover:text-[#0078d4] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="Move Up"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          onClick={() => handleSortProduct(product, 'down')}
                          className="text-[#a5adba] hover:text-[#0078d4] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="Move Down"
                        >
                          <ArrowDown size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-[12px] font-mono text-[#6b778c]">
                        {product.productCode}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-[12px] text-[#6b778c]">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right hidden sm:table-cell">
                      <span className="text-[13px] text-[#a5adba] line-through">
                        ₹{Number(product.mrp).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 py-3 text-right">
                      <span className="text-[12px] sm:text-[13px] font-semibold text-[#172b4d]">
                        ₹{Number(product.price).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 py-3 text-center hidden sm:table-cell">
                      {product.hideProduct ? (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#f4f5f7] text-[#42526e] border border-[#dfe1e6]">
                          Disabled
                        </span>
                      ) : product.outOfStock ? (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#ffebe6] text-[#de350b] border border-[#ffbdad]">
                          Out of Stock
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#e3fcef] text-[#006644] border border-[#abf5d1]">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-2 sm:px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleToggleVisibility(product)}
                          className={`p-1.5 rounded transition-colors ${
                            product.hideProduct 
                              ? 'hover:bg-[#e3fcef] text-[#a5adba] hover:text-[#00875a]' 
                              : 'hover:bg-[#ffebe6] text-[#0078d4] hover:text-[#de350b]'
                          }`}
                          title={product.hideProduct ? "Enable Product" : "Disable Product"}
                        >
                          {product.hideProduct ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-1.5 rounded hover:bg-[#e9f2ff] text-[#6b778c] hover:text-[#0078d4] transition-colors"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-1.5 rounded hover:bg-[#ffebe6] text-[#6b778c] hover:text-[#de350b] transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredProducts.length === 0 && (
        <div className="bg-white rounded-lg border border-[#dfe1e6] flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 bg-[#f4f5f7] rounded-full flex items-center justify-center mb-3">
            <Package size={24} className="text-[#a5adba]" />
          </div>
          <h3 className="text-[15px] font-semibold text-[#172b4d] mb-1">
            No products found
          </h3>
          <p className="text-[13px] text-[#6b778c] mb-4">
            Try adjusting your search or filters.
          </p>
          <button
            onClick={() => {
              setSearchText('');
              setSelectedCategory('');
            }}
            className="text-[13px] font-medium text-[#0078d4] hover:text-[#106ebe]"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsList;
