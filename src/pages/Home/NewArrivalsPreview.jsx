import React, { useEffect, useState } from 'react';
import { Star, ShoppingCart, Eye, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebaseConfig';
import {
  collection,
  query,
  where, // ✅ ADD THIS LINE
  onSnapshot,
} from 'firebase/firestore';

export default function NewArrivalsPreview() {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  // Fetch latest 4 products
  useEffect(() => {
    const q = query(
      collection(db, 'products'),
      where('isFreshArrival', '==', true)
    );

    const unsub = onSnapshot(q, (snap) => {
      setProducts(
        snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    return unsub;
  }, []);

  return (
    <section className="py-24 bg-white relative overflow-hidden font-body">
      {/* Refined background accents */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-red-50/40 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-50/40 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container-custom mx-auto px-6 relative z-10">
        {/* Heading Section */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs font-bold tracking-[0.2em] uppercase mb-5">
            Just Landed
          </span>
          <h2 className="text-4xl md:text-5xl font-black mb-5 text-slate-900 tracking-tight">
            Fresh{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
              Arrivals
            </span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-base md:text-lg">
            Be the first to experience our latest additions — premium quality,
            exciting new effects.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden flex flex-col"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden bg-slate-50">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  <span className="bg-gradient-to-r from-red-500 to-rose-500 text-white text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg shadow-red-500/20">
                    NEW
                  </span>
                </div>

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 flex items-end justify-center pb-5 gap-3">
                  <button
                    className="bg-white text-slate-800 w-9 h-9 rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all shadow-lg transform translate-y-4 group-hover:translate-y-0 duration-300"
                    title="Quick View"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/products/${item.id}`);
                    }}
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => addToCart({ ...item, qty: 1 })}
                    className="bg-white text-slate-800 w-9 h-9 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-lg transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75"
                    title="Add to Cart"
                  >
                    <ShoppingCart size={16} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-1 mb-2">
                  <Star size={13} className="text-amber-400 fill-current" />
                  <span className="text-[11px] font-semibold text-slate-500">
                    {item.rating || 4.5}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-orange-600 transition-colors line-clamp-1">
                  {item.name}
                </h3>

                <div className="mt-auto pt-3 flex items-baseline gap-2 border-t border-slate-50">
                  <span className="text-lg font-black text-slate-900">
                    ₹{item.price}
                  </span>
                  {item.mrp && (
                    <span className="text-sm text-slate-400 line-through">
                      ₹{item.mrp}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="text-center mt-14">
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg group"
          >
            View All New Arrivals
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </div>
    </section>
  );
}
