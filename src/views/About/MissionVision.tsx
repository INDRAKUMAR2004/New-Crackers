"use client";
import React from 'react';
import { Target, Eye } from 'lucide-react';

const MissionVision = () => {
  return (
    <section className="py-16 md:py-20 px-6 bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-light text-accent text-xs font-semibold uppercase tracking-wider mb-4">
            Our Purpose
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Mission &amp; <span className="text-accent">Vision</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Driven by purpose, guided by values, committed to excellence
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Mission */}
          <div className="bg-gray-50 rounded-xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-brand-light text-accent flex items-center justify-center">
                <Target size={20} />
              </div>
              <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                Mission
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              What We Do
            </h3>
            <p className="text-gray-500 leading-relaxed mb-6">
              To bring{' '}
              <span className="text-gray-900 font-semibold">
                safe celebrations
              </span>{' '}
              to every home with world-class fireworks, excellent service, and
              trusted quality. We strive to make every festival memorable while
              prioritizing{' '}
              <span className="text-gray-900 font-semibold">
                sustainability and joy
              </span>
              .
            </p>
            <ul className="space-y-3">
              {[
                'Premium Quality Products',
                'Customer-First Service',
                'Safety & Sustainability',
              ].map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-3 text-sm text-gray-600"
                >
                  <span className="w-1.5 h-1.5 bg-accent rounded-full shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Vision */}
          <div className="bg-gray-50 rounded-xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-brand-light text-accent flex items-center justify-center">
                <Eye size={20} />
              </div>
              <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                Vision
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Where We're Going
            </h3>
            <p className="text-gray-500 leading-relaxed mb-6">
              To become{' '}
              <span className="text-gray-900 font-semibold">
                India's most reliable
              </span>{' '}
              and innovative fireworks brand known for sustainability, safety,
              and value. We envision a future where every celebration is{' '}
              <span className="text-gray-900 font-semibold">
                eco-friendly and joyful
              </span>
              .
            </p>
            <ul className="space-y-3">
              {[
                'Industry Leadership',
                'Innovation & Technology',
                'Eco-Friendly Solutions',
              ].map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-3 text-sm text-gray-600"
                >
                  <span className="w-1.5 h-1.5 bg-accent rounded-full shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;
