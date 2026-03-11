import React from 'react';
import card from '../../assets/image1.jpg';

const AboutBanner = () => {
  return (
    <div className="relative w-full px-6 py-20 md:py-28 overflow-hidden bg-gray-50 border-b border-gray-100">
      {/* Background Image */}
      <img
        src={card}
        alt="Our Story Background"
        className="absolute inset-0 w-full h-full object-cover opacity-10"
      />
      <div className="absolute inset-0 bg-white/70" />

      <div className="relative max-w-5xl mx-auto text-center z-10">
        <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-semibold border border-gray-200 bg-white uppercase tracking-widest text-gray-500 mb-5">
          Trusted Since 2018
        </span>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
          Our <span className="text-accent">Story</span>
        </h1>

        <p className="text-base text-gray-500 max-w-xl mx-auto leading-relaxed mb-12">
          Illuminating celebrations with safety, joy, and trust for over half a
          decade — serving 10K+ happy customers with certified quality.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-3xl mx-auto">
          {[
            { value: '10K+', label: 'Happy Customers' },
            { value: '5+', label: 'Years Experience' },
            { value: '100%', label: 'Safety Certified' },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-3xl font-bold text-accent mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutBanner;
