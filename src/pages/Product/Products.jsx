import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../../admin/ProductContext';
import QuickViewModal from '../../components/QuickViewModal';
import ProductSidebar from './ProductSidebar';
import ProductSection from './ProductSection';
import { ProductGridSkeleton } from '../../components/SkeletonLoader';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
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
  const [searchParams] = useSearchParams();
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
  const [managedCategories, setManagedCategories] = useState([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'categories'), (snapshot) => {
      const next = snapshot.docs
        .map((doc) => ({
          name: (doc.data().name || '').trim(),
          slug: (doc.data().slug || '').trim(),
        }))
        .filter((item) => item.name)
        .sort((a, b) => a.name.localeCompare(b.name));
      setManagedCategories(next);
      setCategoriesLoaded(true);
    });

    return () => unsub();
  }, []);

  const categories = useMemo(() => {
    return managedCategories.map((item) => item.name);
  }, [managedCategories]);

  useEffect(() => {
    const requestedCategory = (searchParams.get('category') || '').trim();
    if (!requestedCategory) return;

    const matchedBySlug = managedCategories.find(
      (item) => item.slug && item.slug === requestedCategory
    );
    const categoryForFilter = matchedBySlug?.name || requestedCategory;
    const isAllowedCategory = managedCategories.some(
      (item) => item.name === categoryForFilter
    );
    if (!isAllowedCategory) return;

    setSelectedCategories((prev) => {
      if (prev.includes(categoryForFilter)) return prev;
      return [...prev, categoryForFilter];
    });
  }, [searchParams, managedCategories]);

  const handleCategoryChange = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // 🔹 Filter Logic
  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      if (product.hideProduct) return false;

      // Only categories configured in Category Management should appear on user pages.
      const belongsToManagedCategory =
        managedCategories.length > 0 &&
        managedCategories.some(
          (item) =>
            item.name === product.category ||
            (item.slug && item.slug === product.categorySlug)
        );
      if (!belongsToManagedCategory) return false;

      // Category Filter (Multi-select)
      const matchesCategory =
        selectedCategories.length > 0
          ? selectedCategories.some(
              (cat) =>
                cat === product.category ||
                cat === product.categorySlug ||
                managedCategories.some(
                  (item) =>
                    item.name === cat &&
                    item.slug &&
                    item.slug === product.categorySlug
                )
            )
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
    managedCategories,
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
      <div className="min-h-screen bg-white pb-16 pt-16">
        {/* Header Skeleton */}
        <div className="bg-gray-50 border-b border-gray-200 mb-8 animate-pulse">
          <div className="container-custom mx-auto px-4 md:px-6 py-8">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-3" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
        </div>

        <div className="container-custom mx-auto px-4 md:px-6">
          {/* Products Grid Skeleton */}
          <ProductGridSkeleton count={12} />
        </div>
      </div>
    );
  }

  if (!categoriesLoaded) {
    return (
      <div className="min-h-screen bg-white pb-16 pt-16 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-gray-200 border-t-gray-400 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-16 pt-16">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 mb-8">
        <div className="container-custom mx-auto px-4 md:px-6 py-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Our Collection
          </h1>
          <p className="text-gray-500 text-sm max-w-xl">
            Explore our curated range of high-quality crackers for every
            occasion.
          </p>
        </div>
      </div>

      <div className="container-custom mx-auto px-4 md:px-6">
        {categories.length > 0 && (
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedCategories([])}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                selectedCategories.length === 0
                  ? 'bg-accent text-white border-accent'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => {
              const active = selectedCategories.includes(cat);
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategories([cat])}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    active
                      ? 'bg-accent text-white border-accent'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* SIDEBAR (Desktop) */}
          <aside className="hidden lg:block w-64 shrink-0">
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
          <div className="lg:hidden mb-2">
            <button
              onClick={() => setShowMobileSidebar(true)}
              className="w-full flex items-center justify-center gap-2 border border-gray-200 py-2.5 rounded-lg font-semibold text-gray-700 text-sm hover:bg-gray-50 transition-colors active:scale-[0.98]"
            >
              <SlidersHorizontal size={16} />
              Filters & Sort
            </button>
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1 min-w-0">
            {/* TOOLBAR */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5 bg-gray-50 p-3 rounded-lg border border-gray-100">
              <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-gray-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-brand-light text-accent' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-brand-light text-accent' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <List size={16} />
                </button>
              </div>

              <span className="text-gray-500 text-sm hidden md:block">
                <span className="font-semibold text-gray-900">
                  {filteredProducts.length}
                </span>{' '}
                products
              </span>

              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm hidden sm:block">
                  Sort:
                </span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-200 pl-3 pr-8 py-1.5 rounded-lg text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent cursor-pointer"
                  >
                    <option value="default">Default</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                    <option value="name-a-z">Name: A to Z</option>
                  </select>
                  <ArrowUpDown
                    size={12}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {/* PRODUCT LISTING */}
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-gray-300 mb-6 border border-gray-100">
                  <FolderSearch size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  No Products Found
                </h3>
                <p className="text-gray-500 text-sm mb-6 max-w-sm text-center">
                  Try adjusting your filters.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategories([]);
                    setMinPrice('');
                    setMaxPrice('');
                    setInStockOnly(false);
                    setOutOfStockOnly(false);
                  }}
                  className="px-5 py-2 bg-accent text-white rounded-lg text-sm font-semibold hover:bg-brand-dark transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="space-y-10">
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
        <div className="fixed inset-0 z-1001 flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowMobileSidebar(false)}
          />
          <div className="relative w-[85%] max-w-[320px] h-full bg-white shadow-xl overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
              <button
                onClick={() => setShowMobileSidebar(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
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

            <div className="mt-6 pt-4 border-t border-gray-100 sticky bottom-0 bg-white pb-4">
              <button
                onClick={() => setShowMobileSidebar(false)}
                className="w-full py-3 bg-accent text-white font-semibold rounded-lg text-sm hover:bg-brand-dark transition-colors"
              >
                Show {filteredProducts.length} Results
              </button>
            </div>
          </div>
        </div>
      )}

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
