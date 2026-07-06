"use client";
import ProductCard from './ProductCard';

const ProductSection = ({ title, products, onQuickView, viewMode = 'grid' }: any) => {
  return (
    <div className="mb-10 bg-white p-5 md:p-6 rounded border border-gray-200 shadow-sm">
      <div className="mb-6 pb-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 border border-gray-200 px-3 py-1 rounded">
          {products.length} {products.length === 1 ? 'Item' : 'Items'}
        </span>
      </div>
      <div
        className={
          viewMode === 'list'
            ? "flex flex-col gap-4"
            : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5"
        }
      >
        {products.map((product: any) => (
          <div key={product.id} className={viewMode === 'grid' ? 'h-full' : ''}>
            <ProductCard product={product} onQuickView={onQuickView} viewMode={viewMode} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSection;
