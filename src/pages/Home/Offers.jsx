import React, { useState, useEffect } from 'react';
import { Timer, Tag, ArrowRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Offers = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({
    days: 5,
    hours: 12,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else {
          seconds = 59;
          if (minutes > 0) minutes--;
          else {
            minutes = 59;
            if (hours > 0) hours--;
            else {
              hours = 23;
              if (days > 0) days--;
            }
          }
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const offers = [
    {
      id: 1,
      title: 'Diwali Super Sale',
      desc: 'Up to 50% OFF on all combos',
      code: 'DIWALI50',
      bg: 'from-orange-500 to-red-600',
      icon: <Zap size={24} className="text-white" />,
    },
    {
      id: 2,
      title: 'Flash Sale',
      desc: 'Limited stock available',
      code: 'FLASH30',
      bg: 'from-blue-500 to-indigo-600',
      icon: <Timer size={24} className="text-white" />,
    },
    {
      id: 3,
      title: 'Bulk Discount',
      desc: 'Get 40% OFF on ₹5000+',
      code: 'BULK40',
      bg: 'from-green-500 to-emerald-600',
      icon: <Tag size={24} className="text-white" />,
    },
  ];

  return (
    <section className="py-24 bg-primary relative overflow-hidden font-sans">
      {/* Premium Background Assets */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-dark/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_100%)] pointer-events-none" />

      <div className="container-custom mx-auto px-6 md:px-8 relative z-10">
        {/* Header & Timer */}
        <div className="flex flex-col lg:flex-row items-center justify-between mb-16 gap-10 border-b border-gold/10 pb-10">
          <div className="text-center lg:text-left">
            <span className="inline-block px-4 py-1.5 mb-5 border border-gold/30 rounded-full text-gold-light text-xs font-bold tracking-[0.25em] uppercase bg-gold-dark/10 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
              Limited Time Only
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 heading-serif tracking-tight">
              Festival <span className="text-gold-gradient">Offers</span>
            </h2>
            <p className="text-gray-400 text-lg font-medium heading-sans max-w-lg">
              Grab exclusive deals on our premium collections before they
              expire.
            </p>
          </div>

          <div className="flex gap-3 sm:gap-5">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} className="flex flex-col items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-center mb-3 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                  <span className="text-3xl sm:text-4xl font-bold text-white heading-sans tracking-widest text-shadow-sm">
                    {String(value).padStart(2, '0')}
                  </span>
                </div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-gold font-bold">
                  {unit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(212,175,55,0.15)] hover:border-gold/30 overflow-hidden"
            >
              {/* Card bg gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${offer.bg} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
              />

              <div className="w-14 h-14 rounded-2xl bg-gold-dark/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-gold-dark transition-all duration-500 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                <div className="text-gold-light group-hover:text-white transition-colors duration-300">
                  {React.cloneElement(offer.icon, {
                    size: 24,
                    strokeWidth: 1.5,
                  })}
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2 heading-sans">
                {offer.title}
              </h3>
              <p className="text-gray-400 text-base mb-8">{offer.desc}</p>

              <div className="bg-black/40 rounded-2xl p-4 border border-dashed border-gold/30 flex items-center justify-between mb-8 group-hover:border-gold transition-colors duration-500">
                <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">
                  Use Code
                </span>
                <span className="text-base font-mono font-bold text-gold-light tracking-[0.2em]">
                  {offer.code}
                </span>
              </div>

              <button
                onClick={() => navigate('/products')}
                className="w-full py-3.5 bg-white text-primary font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-gradient-to-r hover:from-gold-dark hover:to-gold hover:text-primary transition-all duration-500 flex items-center justify-center gap-3 hover:shadow-[0_10px_20px_rgba(212,175,55,0.4)] relative z-10"
              >
                Shop Offer <ArrowRight size={18} strokeWidth={2} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Offers;
