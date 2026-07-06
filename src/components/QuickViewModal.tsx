"use client";
import React from 'react';
import { X, Star, ShoppingCart, Minus, Plus, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const QuickViewModal = ({ product, isOpen, onClose }) => {
  const [qty, setQty] = React.useState(1);
  const { addToCart } = useCart();
  const stockCount = Number(product?.stock) || 0;
  const isOutOfStock = Boolean(product?.outOfStock) || stockCount <= 0;
  // Safely handle missing WishlistContext
  const { isInWishlist, toggleWishlist } = useWishlist
    ? useWishlist()
    : { isInWishlist: () => false, toggleWishlist: () => {} };

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart({ ...product, qty });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full hover:bg-slate-100 transition-colors shadow-sm"
        >
          <X size={24} />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-1/2 bg-slate-100 relative group">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover md:absolute inset-0 transition-transform duration-700 group-hover:scale-105"
          />
          {/* Wishlist Button */}
          {useWishlist && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(product);
              }}
              className={`absolute top-4 left-4 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${isInWishlist(product.id) ? 'bg-red-50 text-red-500' : 'bg-white/90 text-slate-400 hover:text-red-500 hover:bg-red-50'}`}
            >
              <Heart
                size={20}
                className={isInWishlist(product.id) ? 'fill-current' : ''}
              />
            </button>
          )}
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/2 p-8 flex flex-col h-full bg-white max-h-[90vh] overflow-y-auto">
          <div className="mb-auto">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${isOutOfStock ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}
              >
                {isOutOfStock ? 'Sold Out' : 'In Stock'}
              </span>
              {product.discount > 0 && (
                <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full uppercase tracking-wider">
                  {product.discount}% OFF
                </span>
              )}
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-2 font-heading">
              {product.name}
            </h2>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < Math.floor(product.rating || 5)
                        ? 'fill-current'
                        : 'text-slate-300'
                    }
                  />
                ))}
              </div>
              <span className="text-slate-400 text-sm">
                ({product.reviews || 0} reviews)
              </span>
            </div>

            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-4xl font-bold text-slate-900">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-slate-400 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>

            <p className="text-slate-600 mb-6 leading-relaxed">
              Experience premium quality fireworks with our {product.name}.
              Perfect for adding sparkle to your celebrations. Safe, reliable,
              and spectacular.
            </p>

            {/* Quantity */}
            {!isOutOfStock && (
              <div className="flex items-center gap-4 mb-8">
                <span className="text-sm font-bold text-slate-700">
                  Quantity
                </span>
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-l-xl transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-bold text-slate-900">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-r-xl transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex-1 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 ${
                isOutOfStock
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  : 'bg-orange-500 text-white shadow-lg hover:bg-red-600 hover:shadow-orange-500/25 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              <ShoppingCart size={20} />{' '}
              {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
