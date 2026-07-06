"use client";
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
  LayoutGrid,
  List,
  SlidersHorizontal,
  X
} from 'lucide-react';

const Products = () => {
  const { products, loading } = useProducts() as any;
  const [searchParams] = useSearchParams() as any;
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [outOfStockOnly, setOutOfStockOnly] = useState(false);

  // Sort & View
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState('grid');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [managedCategories, setManagedCategories] = useState([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'categories'), (snapshot) => {
      const next = snapshot.docs
        .map((doc) => ({
          name: (doc.data().name || '').trim(),
          slug: (doc.data().slug || '').trim(),
          sortOrder: Number(doc.data().sortOrder) || 0,
        }))
        .filter((item) => item.name)
        .sort((a, b) => a.sortOrder - b.sortOrder);
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

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      if (product.hideProduct) return false;

      const belongsToManagedCategory =
        managedCategories.length > 0 &&
        managedCategories.some(
          (item) =>
            item.name === product.category ||
            (item.slug && item.slug === product.categorySlug)
        );
      if (!belongsToManagedCategory) return false;

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

      const price = Number(product.price);
      const matchesMinPrice = minPrice ? price >= Number(minPrice) : true;
      const matchesMaxPrice = maxPrice ? price <= Number(maxPrice) : true;

      const stock = Number(product.stock || 0);
      let matchesAvailability = true;
      if (inStockOnly && !outOfStockOnly) matchesAvailability = stock > 0;
      if (!inStockOnly && outOfStockOnly) matchesAvailability = stock <= 0;

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

    if (sortBy === 'price-low-high') {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'price-high-low') {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === 'name-a-z') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      result.sort((a, b) => (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0));
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

  const groupedByCategory = useMemo(() => {
    return filteredProducts.reduce((acc, product) => {
      const category = product.category || 'Others';
      if (!acc[category]) acc[category] = [];
      acc[category].push(product);
      return acc;
    }, {});
  }, [filteredProducts]);

  const sortedCategories = useMemo(() => {
    return Object.keys(groupedByCategory).sort((a, b) => {
      const indexA = managedCategories.findIndex(cat => cat.name === a);
      const indexB = managedCategories.findIndex(cat => cat.name === b);
      const posA = indexA !== -1 ? indexA : 9999;
      const posB = indexB !== -1 ? indexB : 9999;
      if (posA === posB) return a.localeCompare(b);
      return posA - posB;
    });
  }, [groupedByCategory, managedCategories]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pb-16 pt-8">
        <div className="container-custom mx-auto">
          <ProductGridSkeleton count={12} />
        </div>
      </div>
    );
  }

  if (!categoriesLoaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600 font-medium">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-10">
      {/* Professional Header */}
      <div className="bg-white border-b border-gray-200 mb-6 pt-10 pb-10">
        <div className="container-custom mx-auto py-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-1">
            Our Collection
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Explore our curated range of high-quality crackers and fireworks.
          </p>
        </div>
      </div>

      <div className="container-custom mx-auto">
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
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowMobileSidebar(true)}
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 py-2 rounded font-medium text-gray-800 text-sm hover:bg-gray-50"
            >
              <SlidersHorizontal size={16} />
              Filters & Sort
            </button>
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1 min-w-0">
            {/* TOOLBAR */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white p-3 rounded border border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-semibold text-gray-900">
                  {filteredProducts.length}
                </span>{' '}
                products found
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 border border-gray-300 rounded">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                    title="Grid View"
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                    title="List View"
                  >
                    <List size={16} />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <label htmlFor="sort-by" className="text-sm text-gray-600 hidden sm:block">Sort:</label>
                  <select
                    id="sort-by"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white border border-gray-300 py-1.5 pl-2 pr-8 rounded text-sm text-gray-800 focus:outline-none focus:border-gray-500 cursor-pointer"
                  >
                    <option value="default">Default</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                    <option value="name-a-z">Alphabetical</option>
                  </select>
                </div>
              </div>
            </div>

            {/* PRODUCT LISTING */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white p-8 border border-gray-200 text-center rounded">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Products Found
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Please try adjusting your filters to find what you're looking for.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategories([]);
                    setMinPrice('');
                    setMaxPrice('');
                    setInStockOnly(false);
                    setOutOfStockOnly(false);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {sortedCategories.map((categoryName) => (
                  <ProductSection
                    key={categoryName}
                    title={categoryName}
                    products={groupedByCategory[categoryName]}
                    onQuickView={(product: any) => setSelectedProduct(product)}
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
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowMobileSidebar(false)}
          />
          <div className="relative w-[85%] max-w-sm h-full bg-white shadow-lg flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <button
                onClick={() => setShowMobileSidebar(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
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
            </div>
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => setShowMobileSidebar(false)}
                className="w-full py-2 bg-gray-900 text-white rounded text-sm font-medium hover:bg-gray-800"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedProduct && (
        <QuickViewModal
          product={selectedProduct}
          isOpen={true}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default Products;
