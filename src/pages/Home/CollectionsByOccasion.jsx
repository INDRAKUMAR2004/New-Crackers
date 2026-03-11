import React from 'react';
import {
  Sparkles,
  Baby,
  HeartHandshake,
  PartyPopper,
  Star,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import image1 from '../../assets/img1.jfif';
import image2 from '../../assets/img2.jfif';
import image3 from '../../assets/img6.jfif';
import image4 from '../../assets/img7.jfif';
import image5 from '../../assets/img5.jfif';

const collections = [
  {
    id: 'diwali-family',
    title: 'Diwali Family Packs',
    subtitle: 'Big value combos for the whole family',
    label: 'Festival Special',
    icon: Sparkles,
    href: '/products',
    img: image1,
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'kids-sparklers',
    title: "Children's Sparklers",
    subtitle: 'Kids-safe, low-noise fun',
    label: 'Kids-safe',
    icon: Baby,
    href: '/products',
    img: image2,
    color: 'from-blue-400 to-cyan-500',
  },
  {
    id: 'wedding-range',
    title: 'Wedding Range',
    subtitle: 'Sangeet, reception & baraat ready',
    label: 'Wedding Collection',
    icon: HeartHandshake,
    href: '/products',
    img: image3,
    color: 'from-pink-500 to-rose-600',
  },
  {
    id: 'party-night',
    title: 'Party & Events',
    subtitle: 'Birthdays, anniversaries & more',
    label: 'Event Ready',
    icon: PartyPopper,
    href: '/products',
    img: image4,
    color: 'from-purple-500 to-violet-600',
  },
  {
    id: 'premium-show',
    title: 'Premium Show Packs',
    subtitle: 'Curated for grand celebrations',
    label: 'Premium',
    icon: Star,
    href: '/products',
    img: image5,
    color: 'from-yellow-500 to-amber-500',
  },
];

export default function CollectionsByOccasion() {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-gradient-to-b from-white to-slate-50 font-body relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100/30 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-xs font-bold tracking-[0.2em] uppercase mb-5">
            Curated Collections
          </span>

          <h2 className="text-4xl md:text-5xl font-black mb-5 text-slate-900 tracking-tight">
            Shop by{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              Occasion
            </span>
          </h2>

          <p className="text-slate-500 max-w-xl mx-auto text-base md:text-lg">
            Discover handpicked cracker sets designed for birthdays, weddings,
            festivals, and more.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          {collections.map((col, index) => {
            const Icon = col.icon;

            // Layout logic
            const colSpan = index < 3 ? 'lg:col-span-2' : 'lg:col-span-3';

            return (
              <div
                key={col.id}
                onClick={() => {
                  navigate(col.href);
                  window.scrollTo(0, 0);
                }}
                className={`group relative h-72 md:h-80 rounded-2xl overflow-hidden
                cursor-pointer transition-all duration-500 hover:-translate-y-1
                hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] ${colSpan}`}
              >
                {/* Image */}
                <img
                  src={col.img}
                  alt={col.title}
                  className="absolute inset-0 w-full h-full object-cover
                  transition-transform duration-700 group-hover:scale-110"
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Color Hover Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${col.color}
                  opacity-0 group-hover:opacity-40 transition-opacity
                  duration-500 mix-blend-overlay`}
                />

                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-white z-10">
                  {/* Top Icon */}
                  <div className="absolute top-6 left-6 flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md
                    flex items-center justify-center border border-white/10"
                    >
                      <Icon size={20} />
                    </div>

                    <span
                      className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md
                    text-xs font-bold border border-white/10 uppercase tracking-widest"
                    >
                      {col.label}
                    </span>
                  </div>

                  <h3
                    className="text-2xl font-bold mb-2 transform translate-y-2
                  group-hover:translate-y-0 transition-transform duration-500"
                  >
                    {col.title}
                  </h3>

                  <p
                    className="text-white/80 mb-6 opacity-0
                  group-hover:opacity-100 transform translate-y-4
                  group-hover:translate-y-0 transition-all duration-500 delay-100"
                  >
                    {col.subtitle}
                  </p>

                  <div
                    className="flex items-center gap-2 text-sm font-bold opacity-0
                  group-hover:opacity-100 transform translate-y-4
                  group-hover:translate-y-0 transition-all duration-500 delay-200"
                  >
                    Explore Collection <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
