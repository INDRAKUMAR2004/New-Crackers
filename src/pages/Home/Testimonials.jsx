import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Star, Quote, CheckCircle2, User } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  {
    name: 'Priya',
    location: 'Chennai',
    message:
      'Amazing quality crackers! Delivery was on time and packaging was excellent. Will order again.',
  },
  {
    name: 'Rahul',
    location: 'Coimbatore',
    message: 'Kids-safe options helped us choose easily. Super fast delivery!',
  },
  {
    name: 'Karthik',
    location: 'Madurai',
    message: 'Value-for-money combo packs. Highly recommended.',
  },
  {
    name: 'Sneha',
    location: 'Trichy',
    message: 'Packaging was neat & safe. Very satisfied!',
  },
  {
    name: 'Vijay',
    location: 'Bengaluru',
    message: 'Fresh items, no damage, quick delivery. Loved it!',
  },
  {
    name: 'Anitha',
    location: 'Salem',
    message: 'Easy-to-use website. Payment smooth. Reordering soon.',
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-slate-900 font-body relative overflow-hidden">
      {/* Bg Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-500/8 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container-custom mx-auto px-6 relative z-10">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-orange-400 text-xs font-bold tracking-[0.2em] uppercase mb-5">
            Customer Reviews
          </span>
          <h2 className="text-4xl md:text-5xl font-black mb-5 text-white tracking-tight">
            What Our{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
              Customers Say
            </span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-base md:text-lg">
            Trusted by thousands of families for quality, safety, and reliable
            service.
          </p>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          pagination={{ clickable: true, dynamicBullets: true }}
          className="pb-16"
        >
          {testimonials.map((t, index) => (
            <SwiperSlide key={index} className="h-auto">
              <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-8 h-full relative group hover:border-orange-500/20 hover:bg-white/[0.05] transition-all duration-500">
                <Quote
                  size={36}
                  className="text-white/5 absolute top-6 right-6 group-hover:text-orange-500/15 transition-all duration-500"
                />

                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="text-yellow-500 fill-current"
                    />
                  ))}
                </div>

                <p className="text-white/60 text-base mb-8 leading-relaxed z-10 relative">
                  &ldquo;{t.message}&rdquo;
                </p>

                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-orange-500/20">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">{t.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">
                        {t.location}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 size={10} /> Verified
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
