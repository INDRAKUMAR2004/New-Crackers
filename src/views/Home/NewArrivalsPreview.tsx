"use client";
import React, { useEffect, useState } from 'react';
import { ShoppingCart, ArrowRight, Star, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default function NewArrivalsPreview() {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, 'products'),
      where('isFreshArrival', '==', true)
    );
    const unsub = onSnapshot(q, (snap) => {
      setProducts(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container-custom mx-auto px-4 md:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={16} className="text-accent" />
              <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                Just Landed
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Fresh Arrivals</h2>
          </div>
          <button
            onClick={() => {
              navigate('/products');
              window.scrollTo(0, 0);
            }}
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-brand-dark transition-colors"
          >
            View All <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {products.map((item) => (
            <div
              key={item.id}
              onClick={() =>
                navigate(
                  `/products/${encodeURIComponent(item.slug || item.id)}`
                )
              }
              className="group bg-white rounded-xl cursor-pointer border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden"
            >
              <div className="relative h-44 md:h-48 overflow-hidden bg-gray-50">
                <span className="absolute top-2 left-2 z-10 bg-accent text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                  NEW
                </span>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3 md:p-4 flex flex-col flex-1">
                <div className="flex items-center gap-1 mb-1.5">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  <span className="text-xs text-gray-500">
                    {item.rating || 4.5}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-accent transition-colors">
                  {item.name}
                </h3>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-bold text-gray-900">
                      ₹{item.price}
                    </span>
                    {item.mrp && (
                      <span className="text-xs text-gray-400 line-through">
                        ₹{item.mrp}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart({ ...item, qty: 1 });
                    }}
                    className="w-8 h-8 rounded-lg bg-brand-light text-accent flex items-center justify-center hover:bg-accent hover:text-white transition-colors"
                  >
                    <ShoppingCart size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-6 md:hidden">
          <button
            onClick={() => {
              navigate('/products');
              window.scrollTo(0, 0);
            }}
            className="inline-flex items-center gap-2 text-sm font-medium text-accent"
          >
            View All Products <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
