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
    <section className="py-20 bg-gradient-to-b from-white to-slate-50/50 relative overflow-hidden font-body">
      <div className="container-custom mx-auto px-6 relative z-10">
        {/* Header & Timer */}
        <div className="flex flex-col lg:flex-row items-center justify-between mb-14 gap-10">
          <div className="text-center lg:text-left">
            <span className="inline-block px-3.5 py-1 mb-4 border border-orange-100 rounded-full text-orange-500 text-xs font-semibold tracking-wider uppercase bg-orange-50">
              Limited Time Only
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Festival{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                Offers
              </span>
            </h2>
            <p className="text-slate-400">
              Grab the best deals before they expire!
            </p>
          </div>

          <div className="flex gap-3 sm:gap-4">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} className="flex flex-col items-center">
                <div className="w-16 h-16 sm:w-18 sm:h-18 bg-white border border-slate-100 rounded-2xl flex items-center justify-center mb-2 shadow-sm">
                  <span className="text-2xl sm:text-3xl font-bold text-slate-900">
                    {String(value).padStart(2, '0')}
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                  {unit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="group relative bg-white border border-slate-100 rounded-2xl p-7 hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:border-slate-200 overflow-hidden"
            >
              <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <div className="text-orange-500">
                  {React.cloneElement(offer.icon, {
                    className: 'text-orange-500',
                    size: 20,
                  })}
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-1.5">
                {offer.title}
              </h3>
              <p className="text-slate-400 text-sm mb-5">{offer.desc}</p>

              <div className="bg-slate-50 rounded-xl p-3.5 border border-dashed border-slate-200 flex items-center justify-between mb-5 group-hover:border-orange-200 transition-colors duration-300">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">
                  Use Code
                </span>
                <span className="text-sm font-mono font-bold text-orange-500 tracking-widest">
                  {offer.code}
                </span>
              </div>

              <button
                onClick={() => navigate('/products')}
                className="w-full py-2.5 bg-slate-900 text-white font-semibold text-sm rounded-xl hover:bg-gradient-to-r hover:from-red-600 hover:to-orange-500 transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-orange-500/20"
              >
                Shop Now <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Offers;
