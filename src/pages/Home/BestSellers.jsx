import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useNavigate } from 'react-router-dom';
import { Heart, Eye, ShoppingCart, ArrowRight, Star } from 'lucide-react';

import { useProducts } from '../../admin/ProductContext';

export default function BestSellers() {
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();
  const swiperRef = useRef(null);

  if (loading) {
    return (
      <div className="py-32 text-center">
        <div className="animate-spin-slow w-12 h-12 border-4 border-slate-200 border-t-slate-800 rounded-full mx-auto mb-4"></div>
        <p className="text-slate-500 font-medium tracking-wide">
          Curating best sellers...
        </p>
      </div>
    );
  }

  // Filter products for Best Sellers
  const bestSellers = products
    .filter((p) => p.isBestSeller && !p.hideProduct && !p.outOfStock)
    .slice(0, 8);

  const goToProducts = () => {
    navigate('/products');
    window.scrollTo(0, 0);
  };

  return (
    <section className="py-28 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden font-body">
      {/* Premium subtle pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-orange-100/30 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-100/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="container-custom mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-xs font-bold tracking-[0.2em] uppercase mb-5">
            Customer Favorites
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-5 tracking-tight leading-[1.1]">
            Best{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              Sellers
            </span>
          </h2>
          <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
            The crackers that light up celebrations everywhere — selected for
            brilliance, performance, and crowd appeal.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Custom Navigation Buttons */}
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="hidden md:flex absolute top-1/2 left-1 z-20 w-12 h-12 rounded-full bg-white border border-slate-100 items-center justify-center text-slate-400 hover:text-black hover:border-black transition-all duration-300 shadow-sm hover:shadow-lg -translate-y-1/2 group"
          >
            <ArrowRight
              className="rotate-180 group-hover:-translate-x-1 transition-transform"
              size={20}
            />
          </button>

          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="hidden md:flex absolute top-1/2 right-1 z-20 w-12 h-12 rounded-full bg-white border border-slate-100 items-center justify-center text-slate-400 hover:text-black hover:border-black transition-all duration-300 shadow-sm hover:shadow-lg -translate-y-1/2 group"
          >
            <ArrowRight
              className="group-hover:translate-x-1 transition-transform"
              size={20}
            />
          </button>

          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            modules={[Pagination, Autoplay, Navigation]}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop={bestSellers.length > 4}
            spaceBetween={40}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 30 },
              1024: { slidesPerView: 3, spaceBetween: 40 },
              1280: { slidesPerView: 4, spaceBetween: 40 },
            }}
            pagination={{ clickable: true, dynamicBullets: true }}
            className="pb-20 !px-4 category-swiper"
          >
            {bestSellers.map((product) => (
              <SwiperSlide key={product.id} className="h-auto">
                <div
                  onClick={() => navigate(`/products/${product.id}`)}
                  className="group bg-white rounded-2xl cursor-pointer transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-slate-100 hover:border-slate-200 h-full flex flex-col overflow-hidden"
                >
                  {/* Image Area */}
                  <div className="relative h-[260px] overflow-hidden bg-slate-50">
                    {/* Discount Badge */}
                    {product.discount && (
                      <div className="absolute top-3 left-3 z-10">
                        <span className="bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-full tracking-wider uppercase">
                          -{product.discount}%
                        </span>
                      </div>
                    )}

                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Badges */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg shadow-orange-500/20">
                        Best Seller
                      </span>
                    </div>

                    {/* Quick Action Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 flex items-end justify-center pb-6 gap-3">
                      <button
                        className="bg-white text-slate-800 w-10 h-10 rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all shadow-lg transform translate-y-4 group-hover:translate-y-0 duration-300"
                        title="Quick View"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/products/${product.id}`);
                        }}
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart({ ...product, qty: 1 });
                        }}
                        className="bg-white text-slate-800 w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-lg transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75"
                        title="Add to Cart"
                      >
                        <ShoppingCart size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-col flex-1 p-5">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-[11px] font-bold text-orange-500 uppercase tracking-wider">
                        {product.category}
                      </p>
                      <div className="flex items-center gap-1">
                        <Star
                          size={12}
                          className="fill-amber-400 text-amber-400"
                        />
                        <span className="text-[11px] font-semibold text-slate-500">
                          4.8
                        </span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mb-1 leading-snug group-hover:text-orange-600 transition-colors line-clamp-1">
                      {product.name}
                    </h3>

                    <div className="mt-auto pt-4 flex items-baseline gap-3 border-t border-slate-50">
                      <span className="text-xl font-black text-slate-900">
                        ₹{product.price}
                      </span>
                      {product.mrp && (
                        <span className="text-sm text-slate-400 line-through">
                          ₹{product.mrp}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="text-center mt-16">
          <button
            onClick={goToProducts}
            className="inline-flex items-center gap-2 border-b border-black pb-1 text-black font-semibold hover:text-orange-600 hover:border-orange-600 transition-all duration-300 text-lg group"
          >
            Explore All Products
            <ArrowRight
              size={18}
              className="group-hover:translate-x-2 transition-transform"
            />
          </button>
        </div>
      </div>
    </section>
  );
}
