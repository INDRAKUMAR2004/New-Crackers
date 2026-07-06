"use client";
import { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { PackageSearch, Save, AlertTriangle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { db } from '../firebaseConfig';
import { useProducts } from './ProductContext';
import {
  InventoryRowSkeleton,
  StatCardSkeleton,
} from '../components/SkeletonLoader';

export default function InventoryManagement() {
  const { products, loading, updateStock } = useProducts();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchText, setSearchText] = useState('');
  const [stockDraft, setStockDraft] = useState({});
  const [savingId, setSavingId] = useState('');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'categories'), (snap) => {
      let docs = snap.docs.map((d) => d.data());
      docs.sort((a, b) => (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0));
      setCategories(docs.map((d) => d.name).filter(Boolean));
    });
    return () => unsub();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const byCategory = selectedCategory
        ? p.category === selectedCategory
        : true;
      const bySearch = searchText
        ? p.name?.toLowerCase().includes(searchText.toLowerCase()) ||
          p.productCode?.toLowerCase().includes(searchText.toLowerCase())
        : true;
      return byCategory && bySearch;
    });
  }, [products, selectedCategory, searchText]);

  const lowStockCount = filteredProducts.filter(
    (p) => (Number(p.stock) || 0) < 20
  ).length;

  const outOfStockCount = filteredProducts.filter(
    (p) => (Number(p.stock) || 0) === 0
  ).length;

  const totalStock = filteredProducts.reduce(
    (sum, p) => sum + (Number(p.stock) || 0),
    0
  );

  const totalStockValue = filteredProducts.reduce(
    (sum, p) => sum + (Number(p.stock) || 0) * (Number(p.price) || 0),
    0
  );

  const getDraftValue = (product) => {
    if (Object.prototype.hasOwnProperty.call(stockDraft, product.id)) {
      return stockDraft[product.id];
    }
    return '';
  };

  const handleStockChange = (productId, value) => {
    if (value === '') {
      setStockDraft((prev) => ({ ...prev, [productId]: '' }));
      return;
    }

    if (!/^\d+$/.test(value)) return;
    setStockDraft((prev) => ({ ...prev, [productId]: value }));
  };

  const saveStock = async (product) => {
    const raw = getDraftValue(product);
    const stockToAdd = Number(raw);
    const currentStock = Number(product.stock) || 0;

    if (!Number.isInteger(stockToAdd) || stockToAdd <= 0) {
      toast.error('Enter a stock quantity to add');
      return;
    }

    setSavingId(product.id);
    try {
      const result = await updateStock(product.id, stockToAdd);

      if (result.success) {
        toast.success(
          `✓ ${product.name}: ${currentStock} + ${stockToAdd} = ${result.stock}`
        );
        setStockDraft((prev) => ({
          ...prev,
          [product.id]: '',
        }));
      } else {
        toast.error(result.message || 'Failed to update stock');
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.message || 'Failed to update stock');
    } finally {
      setSavingId('');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#172b4d]">
            Inventory Management
          </h1>
          <p className="text-[13px] text-[#6b778c] mt-1">
            Manage stock levels and monitor product availability
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <div className="bg-white rounded-lg border border-[#dfe1e6] p-4 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2">
              <p className="text-[12px] text-[#6b778c] uppercase tracking-wide font-semibold">
                Total Stock
              </p>
              <p className="text-2xl font-bold text-[#172b4d] mt-2">
                {totalStock}
              </p>
            </div>
            <div
              className="bg-white rounded-lg border border-[#dfe1e6] p-4 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: '50ms' }}
            >
              <p className="text-[12px] text-[#6b778c] uppercase tracking-wide font-semibold">
                Low Stock Items
              </p>
              <p className="text-2xl font-bold text-[#ff8b00] mt-2">
                {lowStockCount}
              </p>
            </div>
            <div
              className="bg-white rounded-lg border border-[#dfe1e6] p-4 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: '100ms' }}
            >
              <p className="text-[12px] text-[#6b778c] uppercase tracking-wide font-semibold">
                Out of Stock
              </p>
              <p className="text-2xl font-bold text-[#ae2a19] mt-2">
                {outOfStockCount}
              </p>
            </div>
            <div
              className="bg-white rounded-lg border border-[#dfe1e6] p-4 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: '150ms' }}
            >
              <p className="text-[12px] text-[#6b778c] uppercase tracking-wide font-semibold">
                Total Stock Value
              </p>
              <p className="text-2xl font-bold text-[#0078d4] mt-2">
                ₹{totalStockValue.toLocaleString()}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg border border-[#dfe1e6] p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label className="text-[11px] text-[#6b778c] uppercase tracking-wide font-semibold block mb-2">
            Search Product
          </label>
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full px-3 py-2.5 text-[13px] bg-[#fafbfc] border border-[#dfe1e6] rounded text-[#172b4d] placeholder-[#a5adba] outline-none focus:border-[#0078d4] transition-colors"
          />
        </div>
        <div className="sm:min-w-[200px]">
          <label className="text-[11px] text-[#6b778c] uppercase tracking-wide font-semibold block mb-2">
            Filter by Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2.5 text-[13px] bg-[#fafbfc] border border-[#dfe1e6] rounded text-[#42526e] outline-none focus:border-[#0078d4] cursor-pointer transition-colors"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg border border-[#dfe1e6] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#f5f6f8] text-[11px] font-semibold text-[#6b778c] uppercase tracking-wider border-b-2 border-[#dfe1e6]">
                <tr>
                  <th className="px-5 py-4">Product Name</th>
                  <th className="px-4 py-4">SKU</th>
                  <th className="px-4 py-4">Category</th>
                  <th className="px-4 py-4 text-center">Current Stock</th>
                  <th className="px-4 py-4 text-center">New Stock</th>
                  <th className="px-4 py-4 text-right">Action</th>
                </tr>
              </thead>
              <InventoryRowSkeleton count={8} />
            </table>
          </div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-lg border border-[#dfe1e6] py-20 text-center">
          <PackageSearch size={32} className="mx-auto text-[#dfe1e6] mb-4" />
          <p className="text-[14px] font-medium text-[#172b4d] mb-1">
            No Products Found
          </p>
          <p className="text-[12px] text-[#6b778c]">
            {searchText || selectedCategory
              ? 'Try adjusting your filters'
              : 'No products available in inventory'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-[#dfe1e6] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#f5f6f8] text-[11px] font-semibold text-[#6b778c] uppercase tracking-wider border-b-2 border-[#dfe1e6]">
                <tr>
                  <th className="px-5 py-4">Product Name</th>
                  <th className="px-4 py-4">SKU</th>
                  <th className="px-4 py-4">Category</th>
                  <th className="px-4 py-4 text-center">Current Stock</th>
                  <th className="px-4 py-4 text-center">New Stock</th>
                  <th className="px-4 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f0f0]">
                {filteredProducts.map((product) => {
                  const currentStock = Number(product.stock) || 0;
                  const isLow = currentStock < 20;
                  const isOutOfStock = currentStock === 0;
                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-[#f5f7fa] transition-all duration-200 border-b border-[#f0f0f0]"
                    >
                      <td className="px-5 py-4">
                        <div className="text-[13px] font-semibold text-[#172b4d]">
                          {product.name}
                        </div>
                        <div className="text-[11px] text-[#a5adba] mt-0.5">
                          {product.productCode}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-[12px] font-mono bg-[#fafbfc] text-[#6b778c] rounded-sm">
                        {product.productCode}
                      </td>
                      <td className="px-4 py-4 text-[12px] text-[#6b778c]">
                        <span className="inline-block bg-[#f0f0f0] px-2 py-1 rounded-sm">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 text-[12px] font-bold px-3 py-1.5 rounded-md ${
                            isOutOfStock
                              ? 'bg-[#ffe5e5] text-[#ae2a19]'
                              : isLow
                                ? 'bg-[#fff7e6] text-[#ff8b00]'
                                : 'bg-[#e3fcef] text-[#006644]'
                          }`}
                        >
                          {isOutOfStock && <AlertTriangle size={12} />}
                          {isLow && !isOutOfStock && (
                            <AlertTriangle size={12} />
                          )}
                          {currentStock}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <input
                          type="text"
                          value={getDraftValue(product)}
                          placeholder="Add qty"
                          onChange={(e) =>
                            handleStockChange(product.id, e.target.value)
                          }
                          className="w-24 mx-auto px-3 py-2 text-center text-[13px] font-semibold bg-white border-2 border-[#dfe1e6] rounded-md outline-none focus:border-[#0078d4] focus:shadow-md transition-all"
                        />
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => saveStock(product)}
                          disabled={savingId === product.id}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0078d4] text-white rounded-md text-[12px] font-semibold hover:bg-[#106ebe] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#0078d4]"
                        >
                          {savingId === product.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Save size={14} />
                          )}
                          {savingId === product.id ? 'Saving...' : 'Add'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
