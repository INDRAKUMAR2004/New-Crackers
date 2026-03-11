import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Truck } from 'lucide-react';

const HeroStyles = () => (
  <style>{`
    @keyframes fade-in-up {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fade-in-down {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes ken-burns {
      0% { transform: scale(1); }
      100% { transform: scale(1.1); }
    }
    @keyframes shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    .animate-fade-in-up { animation: fade-in-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
    .animate-fade-in-down { animation: fade-in-down 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
    .animate-ken-burns { animation: ken-burns 8s ease-out forwards; }
    .text-shimmer {
      background: linear-gradient(90deg, #fbbf24, #f59e0b, #fcd34d, #f59e0b, #fbbf24);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 4s linear infinite;
    }
  `}</style>
);

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
    }, 6000);
    return () => clearInterval(timer);
  }, [slides]);

  if (slides.length === 0) return <LoadingScreen />;

  return (
    <div className="relative w-full h-[90vh] md:h-screen overflow-hidden bg-[#030305] text-white">
      <HeroStyles />

      {/* Background Slides with Ken Burns */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-[1.5s] ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat ${
              index === currentSlide ? 'animate-ken-burns' : ''
            }`}
            style={{ backgroundImage: `url(${slide.imageUrl})` }}
          />
          {/* Premium multi-layer overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 z-10" />
        </div>
      ))}

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-[100px] z-15 pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/8 rounded-full blur-[120px] z-15 pointer-events-none" />

      {/* Hero Content */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <div className="max-w-5xl w-full mx-auto px-6 flex flex-col items-center text-center">
          {/* Premium Badge */}
          <div
            className="mb-8 animate-fade-in-down"
            style={{ animationDelay: '100ms' }}
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 border border-amber-400/30 rounded-full bg-amber-500/10 backdrop-blur-md text-amber-300 text-xs md:text-sm font-semibold tracking-[0.2em] uppercase">
              <Sparkles size={14} className="animate-pulse" />
              Premium Collection 2025
            </span>
          </div>

          {/* Main Headline */}
          <h1
            key={`h-${currentSlide}`}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-black leading-[1.1] mb-6 tracking-tight animate-fade-in-up"
            style={{ animationDelay: '200ms' }}
          >
            Light Up Every
            <br className="hidden sm:block" />
            Celebration with
            <br />
            <span className="text-shimmer">Premium Fireworks</span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-base md:text-lg lg:text-xl text-white/70 font-medium mb-10 max-w-2xl leading-relaxed animate-fade-in-up"
            style={{ animationDelay: '350ms' }}
          >
            Discover handpicked, certified crackers that bring joy, color, and
            safety to every occasion.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-in-up"
            style={{ animationDelay: '500ms' }}
          >
            <button
              onClick={() => navigate('/products')}
              className="group px-10 py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 rounded-full font-bold text-lg text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
            >
              Shop Now
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>

            <button
              onClick={() => navigate('/products')}
              className="px-10 py-4 rounded-full border-2 border-white/30 text-white font-bold text-lg hover:bg-white hover:text-slate-900 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5"
            >
              View Catalogue
            </button>
          </div>

          {/* Trust Indicators */}
          <div
            className="flex flex-wrap items-center justify-center gap-6 md:gap-10 animate-fade-in-up"
            style={{ animationDelay: '650ms' }}
          >
            {[
              { icon: Shield, text: '100% Certified' },
              { icon: Truck, text: 'Pan-India Delivery' },
              { icon: Sparkles, text: 'Premium Quality' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-white/50">
                <item.icon size={16} className="text-amber-400/70" />
                <span className="text-xs md:text-sm font-medium tracking-wide">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === currentSlide
                  ? 'w-10 bg-gradient-to-r from-orange-400 to-amber-400'
                  : 'w-6 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const LoadingScreen = () => (
  <div className="h-screen w-full flex items-center justify-center bg-[#030305]">
    <div className="w-14 h-14 border-3 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
  </div>
);

export default Hero;
