"use client";
import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  ArrowRight,
  Star,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useProducts } from '../../admin/ProductContext';

export default function BestSellers() {
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const swiperRef = useRef(null);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-6 h-6 border-2 border-gray-200 border-t-accent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  const bestSellers = products
    .filter((p) => p.isBestSeller && !p.hideProduct && !p.outOfStock)
    .slice(0, 8);

  return (
    <section className="py-16 bg-gray-50/50">
      <div className="container-custom mx-auto px-4 md:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Best Sellers
            </h2>
            <p className="text-gray-500 text-sm">
              Most popular crackers loved by our customers
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-colors bg-white"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-colors bg-white"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          modules={[Pagination, Autoplay]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={bestSellers.length > 4}
          spaceBetween={16}
          slidesPerView={1.5}
          breakpoints={{
            640: { slidesPerView: 2.5, spaceBetween: 16 },
            1024: { slidesPerView: 4, spaceBetween: 20 },
          }}
          pagination={{ clickable: true, dynamicBullets: true }}
          className="pb-12 category-swiper"
        >
          {bestSellers.map((product) => (
            <SwiperSlide key={product.id} className="h-auto">
              <div
                onClick={() =>
                  navigate(
                    `/products/${encodeURIComponent(product.slug || product.id)}`
                  )
                }
                className="group bg-white rounded-xl cursor-pointer border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300 h-full flex flex-col overflow-hidden"
              >
                <div className="relative h-48 overflow-hidden bg-gray-50">
                  {product.mrp && product.mrp > product.price && (
                    <span className="absolute top-2 left-2 z-10 bg-accent text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                      -
                      {Math.round(
                        ((product.mrp - product.price) / product.mrp) * 100
                      )}
                      %
                    </span>
                  )}
                  <span className="absolute top-2 right-2 z-10 bg-amber-50 text-amber-700 text-[10px] font-medium px-2 py-0.5 rounded">
                    Best Seller
                  </span>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-center gap-1 mb-2">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span className="text-xs text-gray-500">4.8</span>
                    <span className="text-xs text-gray-300 mx-1">|</span>
                    <span className="text-xs text-gray-400">
                      {product.category}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 line-clamp-1 group-hover:text-accent transition-colors">
                    {product.name}
                  </h3>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-bold text-gray-900">
                        ₹{product.price}
                      </span>
                      {product.mrp && (
                        <span className="text-xs text-gray-400 line-through">
                          ₹{product.mrp}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({ ...product, qty: 1 });
                      }}
                      className="w-8 h-8 rounded-lg bg-brand-light text-accent flex items-center justify-center hover:bg-accent hover:text-white transition-colors"
                    >
                      <ShoppingCart size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="text-center mt-6">
          <button
            onClick={() => {
              navigate('/products');
              window.scrollTo(0, 0);
            }}
            className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-brand-dark transition-colors"
          >
            View All Products <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
