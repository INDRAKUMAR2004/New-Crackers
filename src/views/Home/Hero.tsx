"use client";
import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, Sparkles } from 'lucide-react';

const Hero = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'Sliders'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setSlides(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides]);

  if (slides.length === 0) {
    return (
      <div className="h-[480px] flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-3 border-gray-200 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <section className="relative w-full h-[480px] md:h-[540px] overflow-hidden bg-gray-900">
      {/* Background Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.imageUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container-custom mx-auto px-4 md:px-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full text-white text-xs font-medium mb-5">
              <Sparkles size={14} />
              Premium Collection 2025
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              Light Up Every
              <br />
              Celebration
            </h1>

            <p className="text-white/80 text-base md:text-lg mb-8 max-w-lg leading-relaxed">
              Discover handpicked, certified crackers that bring joy, color, and
              safety to every occasion.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/products')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-medium text-sm hover:bg-brand-dark transition-colors"
              >
                Shop Now
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate('/products')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/15 backdrop-blur-sm text-white border border-white/30 rounded-lg font-medium text-sm hover:bg-white/25 transition-colors"
              >
                View Catalogue
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Hero;
