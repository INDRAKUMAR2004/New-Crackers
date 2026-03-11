import { useState, useMemo } from 'react';
import { useProducts } from '../../admin/ProductContext';
import QuickViewModal from '../../components/QuickViewModal';
import ProductSidebar from './ProductSidebar';
import ProductSection from './ProductSection';
import {
  FolderSearch,
  LayoutGrid,
  List,
  SlidersHorizontal,
  ArrowUpDown,
  X,
} from 'lucide-react';

const Products = () => {
  const { products, loading } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [outOfStockOnly, setOutOfStockOnly] = useState(false);

  // Sort & View
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState('grid'); // grid | list
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = products.map((p) => p.category || 'Others');
    return [...new Set(cats)].sort();
  }, [products]);

  const handleCategoryChange = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // 🔹 Filter Logic
  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      if (product.hideProduct) return false;

      // Category Filter (Multi-select)
      const matchesCategory =
        selectedCategories.length > 0
          ? selectedCategories.includes(product.category)
          : true;

      // Price Filter
      const price = Number(product.price);
      const matchesMinPrice = minPrice ? price >= Number(minPrice) : true;
      const matchesMaxPrice = maxPrice ? price <= Number(maxPrice) : true;

      // Availability Filter
      const stock = Number(product.stock || 0);
      let matchesAvailability = true;
      if (inStockOnly && !outOfStockOnly) matchesAvailability = stock > 0;
      if (!inStockOnly && outOfStockOnly) matchesAvailability = stock <= 0;

      // Search Filter (if active from a top bar, optional)
      const matchesSearch = searchTerm
        ? product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      return (
        matchesCategory &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesAvailability &&
        matchesSearch
      );
    });

    // 🔹 Sort Logic
    if (sortBy === 'price-low-high') {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'price-high-low') {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === 'name-a-z') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [
    products,
    selectedCategories,
    minPrice,
    maxPrice,
    inStockOnly,
    outOfStockOnly,
    searchTerm,
    sortBy,
  ]);

  // 🔹 Group filtered products by category
  const groupedByCategory = useMemo(() => {
    return filteredProducts.reduce((acc, product) => {
      const category = product.category || 'Others';
      if (!acc[category]) acc[category] = [];
      acc[category].push(product);
      return acc;
    }, {});
  }, [filteredProducts]);

  const sortedCategories = Object.keys(groupedByCategory).sort();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">
            Loading premium crackers...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans pt-24 md:pt-32">
      {/* Header Banner */}
      <div className="bg-white border-b border-slate-100 relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-50/50 to-red-50/30 pointer-events-none" />
        <div className="container mx-auto px-6 py-8 relative">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-[10px] font-bold tracking-[0.15em] uppercase mb-3">
            Our Collection
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-2">
            Premium{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              Collection
            </span>
          </h1>
          <p className="text-slate-500 font-medium text-base md:text-lg">
            Explore our wide range of high-quality crackers for every occasion.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* SIDEBAR (Desktop) */}
          <aside className="hidden lg:block w-72 shrink-0">
            <ProductSidebar
              categories={categories}
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
              products={products}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              inStockOnly={inStockOnly}
              setInStockOnly={setInStockOnly}
              outOfStockOnly={outOfStockOnly}
              setOutOfStockOnly={setOutOfStockOnly}
            />
          </aside>

          {/* MOBILE FILTER TOGGLE */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowMobileSidebar(true)}
              className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 py-3 rounded-xl font-bold text-slate-700 shadow-sm transition-all active:scale-95"
            >
              <SlidersHorizontal size={18} />
              Filters & Sort
            </button>
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1">
            {/* TOOLBAR */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white p-3 md:p-4 rounded-2xl border border-slate-100 shadow-sm">
              {/* View Toggles */}
              <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all duration-300 ${viewMode === 'grid' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <LayoutGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all duration-300 ${viewMode === 'list' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <List size={18} />
                </button>
              </div>

              <div className="text-slate-400 font-semibold text-sm hidden md:block">
                {filteredProducts.length} products found
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2.5">
                <span className="text-slate-400 font-medium text-sm hidden sm:block">
                  Sort:
                </span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-slate-50 border border-slate-200 pl-4 pr-10 py-2 rounded-xl font-semibold text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-200 cursor-pointer hover:border-slate-300 transition-all duration-300"
                  >
                    <option value="default">Default</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                    <option value="name-a-z">Name: A to Z</option>
                  </select>
                  <ArrowUpDown
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {/* PRODUCT LISTING */}
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 bg-gradient-to-b from-white to-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl flex items-center justify-center text-orange-300 mb-6 rotate-3">
                  <FolderSearch size={36} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  No products found
                </h3>
                <p className="text-slate-400 text-sm mb-6">
                  Try adjusting your filters or search criteria
                </p>
                <button
                  onClick={() => {
                    setSelectedCategories([]);
                    setMinPrice('');
                    setMaxPrice('');
                    setInStockOnly(false);
                    setOutOfStockOnly(false);
                  }}
                  className="px-6 py-2.5 bg-slate-900 text-white rounded-full text-sm font-semibold hover:bg-black transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/20"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="space-y-12">
                {sortedCategories.map((categoryName) => (
                  <ProductSection
                    key={categoryName}
                    title={categoryName}
                    products={groupedByCategory[categoryName]}
                    onQuickView={(product) => setSelectedProduct(product)}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE SIDEBAR DRAWER */}
      {showMobileSidebar && (
        <div className="fixed inset-0 z-[1001] flex lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowMobileSidebar(false)}
          ></div>

          {/* Drawer */}
          <div className="relative w-[300px] h-full bg-white shadow-2xl overflow-y-auto p-6 animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black font-heading text-slate-900">
                Filters
              </h2>
              <button
                onClick={() => setShowMobileSidebar(false)}
                className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-500 hover:text-red-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <ProductSidebar
              categories={categories}
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
              products={products}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              inStockOnly={inStockOnly}
              setInStockOnly={setInStockOnly}
              outOfStockOnly={outOfStockOnly}
              setOutOfStockOnly={setOutOfStockOnly}
            />
            <div className="mt-8 pt-4 border-t border-slate-100 sticky bottom-0 bg-white pb-4">
              <button
                onClick={() => setShowMobileSidebar(false)}
                className="w-full py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-200 hover:bg-red-700 transition-all active:scale-95"
              >
                Show {filteredProducts.length} Results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {selectedProduct && (
        <QuickViewModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default Products;
