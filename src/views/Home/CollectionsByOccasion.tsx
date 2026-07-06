"use client";
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

import image1 from '../../assets/img1.jpg';
import image2 from '../../assets/img2.jpg';
import image3 from '../../assets/img6.jpg';
import image4 from '../../assets/img7.jpg';
import image5 from '../../assets/img5.jpg';

const collections = [
  {
    id: 'diwali-family',
    title: 'Diwali Family Packs',
    subtitle: 'Big value combos for the whole family',
    icon: Sparkles,
    href: '/products',
    img: image1,
  },
  {
    id: 'kids-sparklers',
    title: "Children's Sparklers",
    subtitle: 'Kids-safe, low-noise fun',
    icon: Baby,
    href: '/products',
    img: image2,
  },
  {
    id: 'wedding-range',
    title: 'Wedding Range',
    subtitle: 'Sangeet, reception & baraat ready',
    icon: HeartHandshake,
    href: '/products',
    img: image3,
  },
  {
    id: 'party-night',
    title: 'Party & Events',
    subtitle: 'Birthdays, anniversaries & more',
    icon: PartyPopper,
    href: '/products',
    img: image4,
  },
  {
    id: 'premium-show',
    title: 'Premium Show Packs',
    subtitle: 'Curated for grand celebrations',
    icon: Star,
    href: '/products',
    img: image5,
  },
];

export default function CollectionsByOccasion() {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-gray-50/50">
      <div className="container-custom mx-auto px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Shop by Occasion
          </h2>
          <p className="text-gray-500 text-sm max-w-lg mx-auto">
            Handpicked cracker sets for birthdays, weddings, festivals, and
            grand celebrations.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {collections.map((col) => {
            const Icon = col.icon;
            return (
              <div
                key={col.id}
                onClick={() => {
                  navigate(col.href);
                  window.scrollTo(0, 0);
                }}
                className="group relative h-52 md:h-64 rounded-xl overflow-hidden cursor-pointer border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300"
              >
                <img
                  src={col.img}
                  alt={col.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon size={14} />
                    <span className="text-[10px] font-medium uppercase tracking-wider opacity-80">
                      {col.subtitle}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold leading-tight">
                    {col.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
