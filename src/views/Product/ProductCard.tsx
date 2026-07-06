"use client";
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, viewMode = 'grid' }: any) => {
  const [qty, setQty] = useState(1);
  const navigate = useNavigate();
  const productPath = `/products/${encodeURIComponent(product.slug || product.id)}`;

  const stockCount = Number(product.stock) || 0;
  const isAvailable = !product.outOfStock && stockCount > 0;
  
  const originalPrice = Number(product.mrp) || 0;
  const sellingPrice = Number(product.price) || 0;
  const hasPrice = sellingPrice > 0;
  
  const discountPercent = originalPrice > sellingPrice && sellingPrice > 0
    ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100)
    : 0;

  const { addToCart, cart } = useCart() as any;
  const { isInWishlist, toggleWishlist } = useWishlist() as any;
  const isInCart = (cart || []).some((item: any) => item.id === product.id);

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

  const isList = viewMode === 'list';

  return (
    <div className={`bg-white border border-gray-200 rounded hover:border-gray-400 transition-colors duration-200 flex relative group ${isList ? 'flex-row items-stretch p-3 gap-4 h-auto' : 'flex-col h-full'}`}>
      
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {discountPercent > 0 && (
          <span className="bg-red-600 text-white text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm">
            {discountPercent}% OFF
          </span>
        )}
      </div>

      {/* Wishlist */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product.id, product);
        }}
        className="absolute top-2 right-2 z-20 p-1 text-gray-400 hover:text-red-500 bg-white/80 rounded"
        title="Add to Wishlist"
      >
        <Heart
          size={16}
          className={isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}
        />
      </button>

      {/* Image */}
      <div
        className={`relative cursor-pointer flex items-center justify-center bg-white ${isList ? 'w-32 h-32 md:w-40 md:h-40 shrink-0 border border-gray-100 rounded' : 'h-48 w-full p-2'}`}
        onClick={() => navigate(productPath)}
      >
        <img
          src={product.image || '/placeholder.png'}
          alt={product.name}
          className="max-w-full max-h-full object-contain group-hover:opacity-90 transition-opacity duration-200"
        />
        {!isAvailable && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
            <span className="bg-gray-800 text-white px-3 py-1 text-xs font-semibold rounded-sm">
              SOLD OUT
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className={`flex flex-col flex-1 ${isList ? 'py-1 pr-1' : 'p-3 border-t border-gray-100'}`}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-gray-500 uppercase tracking-wide truncate">
            {product.category || 'Product'}
          </span>
          <div className="flex items-center gap-1">
            <Star size={10} className="fill-yellow-400 text-yellow-400" />
            <span className="text-[10px] text-gray-600">4.8</span>
          </div>
        </div>

        <h3
          onClick={(e) => {
            e.stopPropagation();
            navigate(productPath);
          }}
          className={`text-gray-900 font-medium mb-2 line-clamp-2 cursor-pointer hover:text-blue-600 hover:underline ${isList ? 'text-base md:text-lg' : 'text-sm'}`}
        >
          {product.name}
        </h3>

        <div className={`mt-auto ${isList ? 'flex flex-col sm:flex-row sm:items-end justify-between gap-4' : ''}`}>
          <div>
          {hasPrice ? (
            <div className="flex items-baseline gap-1.5 mb-3">
              <span className="text-base font-semibold text-gray-900">
                ₹{sellingPrice}
              </span>
              {originalPrice > sellingPrice && (
                <span className="text-xs text-gray-500 line-through">
                  ₹{originalPrice}
                </span>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-500 mb-3">
              Price Unavailable
            </div>
          )}

          </div>

          <div className={isList ? 'w-full sm:w-48 shrink-0' : 'w-full'}>
            {isAvailable ? (
              <div className={`flex ${isList ? 'flex-row sm:flex-col items-center sm:items-stretch' : 'flex-col'} gap-2`}>
                <div className={`flex items-center border border-gray-300 rounded h-9 ${isList ? 'w-24 sm:w-full shrink-0' : 'w-full'}`}>
                  <button
                    onClick={dec}
                    className="w-8 h-full text-gray-600 hover:bg-gray-100 flex items-center justify-center font-bold"
                  >
                    −
                  </button>
                  <span className="flex-1 text-center text-gray-900 text-sm font-medium border-x border-gray-300 h-full flex items-center justify-center bg-gray-50">
                    {qty}
                  </span>
                  <button
                    onClick={inc}
                    className="w-8 h-full text-gray-600 hover:bg-gray-100 flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={add}
                  disabled={isInCart}
                  className={`flex-1 h-9 rounded text-sm font-medium flex items-center justify-center gap-1.5 transition-colors ${
                    isInCart
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  <ShoppingCart size={14} />
                  {isInCart ? 'Added' : 'Add to Cart'}
                </button>
              </div>
            ) : (
              <button
                disabled
                className="w-full h-9 bg-gray-200 text-gray-500 rounded text-sm font-medium cursor-not-allowed"
              >
                Out of Stock
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
