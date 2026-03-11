import { Star, ShoppingCart, Eye, Heart, Package } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const [qty, setQty] = useState(1);
  const navigate = useNavigate();

  const isAvailable = !product.outOfStock;
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
    <div className="group bg-white rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col h-full overflow-hidden relative">
      {discountPercent > 0 && (
        <span className="absolute top-3 left-3 z-10 bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-md">
          -{discountPercent}%
        </span>
      )}

      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product);
        }}
        className={`absolute top-3 right-3 z-20 p-2 rounded-full transition-all duration-300 ${
          isInWishlist(product.id)
            ? 'bg-red-50 text-red-500'
            : 'bg-white/80 backdrop-blur-sm text-slate-400 hover:bg-red-50 hover:text-red-500 opacity-0 group-hover:opacity-100'
        }`}
      >
        <Heart
          size={16}
          className={isInWishlist(product.id) ? 'fill-current' : ''}
        />
      </button>

      <div
        className="relative h-52 overflow-hidden bg-slate-50 cursor-pointer"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 flex items-end justify-center pb-5 transition-all duration-400">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/products/${product.id}`);
            }}
            className="bg-white text-slate-800 w-9 h-9 rounded-full flex items-center justify-center shadow-lg hover:bg-orange-500 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300"
          >
            <Eye size={16} />
          </button>
        </div>

        {!isAvailable && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-slate-800 text-white px-4 py-1.5 rounded-full text-xs font-bold">
              Sold Out
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-1 mb-1.5">
          <Star size={13} className="text-amber-400 fill-current" />
          <span className="text-[11px] font-semibold text-slate-400">
            4.8 (120)
          </span>
        </div>

        <h3
          onClick={() => navigate(`/product/${product.id}`)}
          className="font-bold text-slate-900 text-sm mb-2 line-clamp-2 cursor-pointer hover:text-orange-600 transition-colors"
        >
          {product.name}
        </h3>

        <div className="mt-auto">
          <div className="flex items-end justify-between mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-slate-900">
                ₹{sellingPrice}
              </span>
              {originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{originalPrice}
                </span>
              )}
            </div>

            <div
              className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold ${
                isAvailable
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-red-50 text-red-500'
              }`}
            >
              <Package size={10} />
              {isAvailable ? 'IN STOCK' : 'SOLD OUT'}
            </div>
          </div>

          {isAvailable ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-50 rounded-lg h-9 border border-slate-100">
                <button
                  onClick={dec}
                  className="w-7 h-full font-bold text-slate-400 hover:text-slate-700 transition-colors text-sm"
                >
                  −
                </button>
                <span className="w-7 text-center font-bold text-slate-800 text-sm">
                  {qty}
                </span>
                <button
                  onClick={inc}
                  className="w-7 h-full font-bold text-slate-400 hover:text-slate-700 transition-colors text-sm"
                >
                  +
                </button>
              </div>

              <button
                onClick={add}
                disabled={isInCart}
                className={`flex-1 h-9 rounded-lg font-bold flex items-center justify-center gap-1.5 text-sm transition-all duration-300 ${
                  isInCart
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-900 text-white hover:bg-orange-500'
                }`}
              >
                <ShoppingCart size={15} />
                {isInCart ? 'Added' : 'Add'}
              </button>
            </div>
          ) : (
            <button
              disabled
              className="w-full h-9 bg-slate-50 text-slate-400 rounded-lg font-bold text-sm"
            >
              Notify Me
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
