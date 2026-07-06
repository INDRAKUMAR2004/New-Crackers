"use client";
import React from 'react';
import { CheckCircle, FlaskRound, Package, ShieldCheck } from 'lucide-react';

const QualitySafety = () => {
  const safetyFeatures = [
    {
      icon: <CheckCircle size={22} />,
      title: 'PESO Approved',
      desc: 'All products are officially certified and comply with Indian safety standards',
    },
    {
      icon: <FlaskRound size={22} />,
      title: 'Lab Tested',
      desc: 'Rigorous testing for controlled ignition, minimal smoke, and optimal performance',
    },
    {
      icon: <Package size={22} />,
      title: 'Premium Packaging',
      desc: 'Moisture-resistant packaging to maintain freshness and prevent damage',
    },
    {
      icon: <ShieldCheck size={22} />,
      title: 'Quality Assurance',
      desc: 'Strict quality control at every stage from manufacturing to delivery',
    },
  ];

  return (
    <section className="py-16 md:py-20 px-6 bg-gray-50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-light text-accent text-xs font-semibold uppercase tracking-wider mb-4">
            Quality &amp; Safety
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Your <span className="text-accent">Safety</span> is Our Top Priority
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            We follow the highest safety standards to ensure every celebration
            is filled with joy, not worry.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {safetyFeatures.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-6 border border-gray-100 hover:border-accent/20 hover:shadow-sm transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-brand-light text-accent flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-8 md:p-10 text-center border border-gray-100 shadow-sm">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Safety First, <span className="text-accent">Joy Always</span>
          </h3>
          <p className="text-gray-500 max-w-xl mx-auto">
            Every product undergoes rigorous testing and quality checks before
            reaching your hands.
          </p>
        </div>
      </div>
    </section>
  );
};

export default QualitySafety;
