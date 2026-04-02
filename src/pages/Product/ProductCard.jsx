import { Star, ShoppingCart, Heart, Package } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const [qty, setQty] = useState(1);
  const navigate = useNavigate();
  const productPath = `/products/${encodeURIComponent(product.slug || product.id)}`;

  const stockCount = Number(product.stock) || 0;
  const isAvailable = !product.outOfStock && stockCount > 0;
  const originalPrice = product.mrp || null;
  const sellingPrice = product.price || null;
  const discountPercent = originalPrice
    ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100)
    : 0;

  const { addToCart, cart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isInCart = cart.some((item) => item.id === product.id);

  const inc = (e) => {
    e.stopPropagation();
    setQty((p) => p + 1);
  };
  const dec = (e) => {
    e.stopPropagation();
    if (qty > 1) setQty((p) => p - 1);
  };
  const add = (e) => {
    e.stopPropagation();
    addToCart({ ...product, qty });
    setQty(1);
  };

  return (
    <div className="group bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300 flex flex-col h-full overflow-hidden relative">
      {discountPercent > 0 && (
        <span className="absolute top-2 left-2 z-10 bg-accent text-white text-[10px] font-semibold px-2 py-0.5 rounded">
          -{discountPercent}%
        </span>
      )}

      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product);
        }}
        className={`absolute top-2 right-2 z-20 p-1.5 rounded-lg transition-colors ${
          isInWishlist(product.id)
            ? 'bg-red-50 text-red-500'
            : 'bg-white/80 text-gray-300 opacity-0 group-hover:opacity-100 hover:text-red-400'
        }`}
      >
        <Heart
          size={16}
          className={isInWishlist(product.id) ? 'fill-current' : ''}
        />
      </button>

      <div
        className="relative h-44 md:h-48 overflow-hidden bg-gray-50 cursor-pointer"
        onClick={() => navigate(productPath)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {!isAvailable && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <span className="bg-red-50 text-red-500 border border-red-100 px-3 py-1 rounded text-xs font-semibold">
              Sold Out
            </span>
          </div>
        )}
      </div>

      <div className="p-3 md:p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider truncate max-w-[60%]">
            {product.category || 'Premium'}
          </span>
          <div className="flex items-center gap-0.5">
            <Star size={10} className="fill-amber-400 text-amber-400" />
            <span className="text-[10px] text-gray-500">4.8</span>
          </div>
        </div>

        <h3
          onClick={(e) => {
            e.stopPropagation();
            navigate(productPath);
          }}
          className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-accent transition-colors"
        >
          {product.name}
        </h3>

        <div className="mt-auto border-t border-gray-50 pt-3">
          <div className="flex items-end justify-between mb-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base md:text-lg font-bold text-gray-900">
                ₹{sellingPrice}
              </span>
              {originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{originalPrice}
                </span>
              )}
            </div>
            <span
              className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${isAvailable ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}
            >
              {isAvailable ? 'In Stock' : 'Sold Out'}
            </span>
          </div>

          {isAvailable ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-gray-200 rounded-lg h-8 shrink-0">
                <button
                  onClick={dec}
                  className="w-7 h-full text-gray-400 hover:text-gray-600 transition-colors text-sm flex items-center justify-center"
                >
                  −
                </button>
                <span className="w-6 text-center font-semibold text-gray-900 text-xs">
                  {qty}
                </span>
                <button
                  onClick={inc}
                  className="w-7 h-full text-gray-400 hover:text-gray-600 transition-colors text-sm flex items-center justify-center"
                >
                  +
                </button>
              </div>
              <button
                onClick={add}
                disabled={isInCart}
                className={`flex-1 h-8 rounded-lg font-semibold flex items-center justify-center gap-1.5 text-xs transition-colors ${
                  isInCart
                    ? 'bg-green-50 text-green-600 border border-green-100'
                    : 'bg-accent text-white hover:bg-brand-dark'
                }`}
              >
                <ShoppingCart size={12} />
                {isInCart ? 'Added' : 'Add'}
              </button>
            </div>
          ) : (
            <button
              disabled
              className="w-full h-8 bg-gray-50 text-gray-400 border border-gray-100 rounded-lg text-xs font-medium"
            >
              Sold Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
