"use client";
import React from 'react';
import { ShieldCheck, Truck, Clock, CreditCard } from 'lucide-react';

const TrustBadges = () => {
  const features = [
    {
      icon: ShieldCheck,
      title: '100% Safe',
      desc: 'Licensed & Certified Fireworks',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      desc: 'Pan-India Shipping Available',
    },
    { icon: Clock, title: '24/7 Support', desc: 'Dedicated Customer Care' },
    {
      icon: CreditCard,
      title: 'Secure Payment',
      desc: '100% Secure Transactions',
    },
  ];

  return (
    <section className="border-b border-gray-100 bg-white">
      <div className="container-custom mx-auto px-4 md:px-6 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-3 py-2">
              <div className="w-10 h-10 rounded-lg bg-brand-light flex items-center justify-center shrink-0">
                <f.icon size={20} className="text-accent" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{f.title}</p>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
