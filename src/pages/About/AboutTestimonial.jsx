// src/components/AboutTestimonial.jsx
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import avatar from '../../assets/user.png';

const testimonials = [
  {
    name: 'Rajesh Kumar',
    role: 'Verified Customer',
    message:
      'Best quality crackers at the best prices! The team ensured safe delivery and the products were fresh. Our Diwali celebration was absolutely amazing. Highly recommended!',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'Regular Buyer',
    message:
      'Very professional service and super safe packing. I’ve been buying every year and they never disappoint. Prices are also very reasonable.',
    rating: 5,
  },
  {
    name: 'Mohammed Ali',
    role: 'First-time Customer',
    message:
      'Was a bit nervous ordering crackers online, but everything was smooth. On-time delivery, no damage, and great variety of items!',
    rating: 4.5,
  },
];

const AboutTestimonial = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = testimonials.length;

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 5000); // 5 seconds

    return () => clearInterval(timer);
  }, [total]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const active = testimonials[currentIndex];

  return (
    <section className="py-16 md:py-20 px-6 bg-white border-t border-gray-100">
      <div className="max-w-3xl mx-auto relative">
        {/* Desktop Arrows */}
        <button
          onClick={handlePrev}
          className="hidden md:flex absolute -left-14 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-lg border border-gray-200 items-center justify-center hover:border-accent hover:text-accent transition-colors bg-white"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={handleNext}
          className="hidden md:flex absolute -right-14 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-lg border border-gray-200 items-center justify-center hover:border-accent hover:text-accent transition-colors bg-white"
        >
          <ChevronRight size={20} />
        </button>

        <div className="text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            What Our <span className="text-accent">Customers Say</span>
          </h3>

          <div className="bg-gray-50 rounded-xl p-8 md:p-10 border border-gray-100 min-h-[280px] flex flex-col items-center justify-center">
            <p className="text-4xl text-accent/30 mb-4 font-serif">"</p>
            <blockquote className="text-gray-600 text-lg leading-relaxed mb-8 max-w-2xl">
              {active.message}
            </blockquote>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-brand-light">
                <img
                  src={avatar}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">{active.name}</div>
                <div className="text-accent text-xs font-medium">
                  {active.role}
                </div>
              </div>
            </div>

            <div className="flex gap-1 text-amber-400">
              {Array.from({ length: Math.floor(active.rating) }).map((_, i) => (
                <span key={i}>★</span>
              ))}
              {active.rating % 1 !== 0 && <span className="opacity-40">★</span>}
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-6 bg-accent'
                    : 'w-2 bg-gray-200 hover:bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Mobile Arrows */}
          <div className="flex md:hidden justify-center gap-3 mt-5">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutTestimonial;
