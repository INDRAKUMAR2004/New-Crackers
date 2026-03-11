import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, ShieldCheck, Wallet, Truck } from 'lucide-react';
import images from '../../assets/images2.jpg';

const WhoWeAre = () => {
  const navigate = useNavigate();

  const goToProducts = () => {
    navigate('/products');
    window.scrollTo(0, 0);
  };

  const features = [
    { icon: Award, title: 'Premium Quality', desc: 'PESO certified products' },
    {
      icon: ShieldCheck,
      title: 'Safe & Tested',
      desc: 'Rigorous safety checks',
    },
    { icon: Wallet, title: 'Best Prices', desc: 'Affordable for everyone' },
    { icon: Truck, title: 'Fast Delivery', desc: 'On-time guaranteed' },
  ];

  return (
    <section className="py-16 md:py-20 px-6 bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Image */}
          <div className="relative rounded-2xl overflow-hidden border border-gray-100">
            <img
              src={images}
              alt="Fireworks Celebration"
              className="w-full h-[450px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold">
                  5+
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  Years of Excellence
                </span>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="space-y-6">
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-light text-accent text-xs font-semibold uppercase tracking-wider">
              Who We Are
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Bringing Joy to Every{' '}
              <span className="text-accent">Celebration</span>
            </h2>

            <p className="text-gray-500 leading-relaxed">
              We are a{' '}
              <span className="text-gray-900 font-semibold">
                trusted fireworks distributor
              </span>{' '}
              committed to delivering high-quality & safe crackers at
              competitive prices. Our team ensures festival joy reaches every
              home with{' '}
              <span className="text-gray-900 font-semibold">
                responsibility and trust
              </span>
              .
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {features.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 border border-gray-100 rounded-xl p-4 hover:border-accent/30 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-brand-light text-accent flex items-center justify-center shrink-0">
                      <item.icon size={18} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-0.5">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={goToProducts}
              className="mt-4 bg-accent text-white font-semibold px-6 py-3 rounded-lg hover:bg-brand-dark transition-colors flex items-center gap-2 text-sm"
            >
              Explore Our Products <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
