import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Star, Quote, CheckCircle2 } from 'lucide-react';
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
    <section className="py-16 bg-white">
      <div className="container-custom mx-auto px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            What Our Customers Say
          </h2>
          <p className="text-gray-500 text-sm max-w-lg mx-auto">
            Trusted by thousands of families across India for quality and
            reliable service.
          </p>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          pagination={{ clickable: true, dynamicBullets: true }}
          className="pb-12 category-swiper"
        >
          {testimonials.map((t, index) => (
            <SwiperSlide key={index} className="h-auto">
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 h-full relative group hover:border-gray-200 hover:shadow-sm transition-all duration-300">
                <Quote
                  size={28}
                  className="text-gray-200 absolute top-4 right-4"
                />
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className="fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  "{t.message}"
                </p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-9 h-9 rounded-full bg-brand-light text-accent flex items-center justify-center text-sm font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">
                      {t.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-400">
                        {t.location}
                      </span>
                      <span className="text-[10px] text-green-600 flex items-center gap-0.5 font-medium">
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
