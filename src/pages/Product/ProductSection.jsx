import ProductCard from './ProductCard';

const ProductSection = ({ title, products, onQuickView }) => {
  return (
    <div className="mb-10 last:mb-0">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {products.length} Products
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.id} className="h-full">
            <ProductCard product={product} onQuickView={onQuickView} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSection;
