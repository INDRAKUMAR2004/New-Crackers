"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Users, Trophy, Star, ShieldCheck } from 'lucide-react';

const CustomerTrust = () => {
  const stats = [
    {
      number: '10000',
      suffix: '+',
      label: 'Happy Customers',
      icon: <Users size={22} />,
    },
    {
      number: '5',
      suffix: '+',
      label: 'Years Experience',
      icon: <Trophy size={22} />,
    },
    {
      number: '4.9',
      suffix: ' ★',
      label: 'Average Rating',
      icon: <Star size={22} />,
    },
    {
      number: '100',
      suffix: '%',
      label: 'Safety Certified',
      icon: <ShieldCheck size={22} />,
    },
  ];

  const [counters, setCounters] = useState(stats.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          stats.forEach((stat, index) => {
            const target = parseFloat(stat.number);
            const duration = 2000;
            const steps = 60;
            const increment = target / steps;
            let current = 0;
            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                current = target;
                clearInterval(timer);
              }
              setCounters((prev) => {
                const n = [...prev];
                n[index] = current;
                return n;
              });
            }, duration / steps);
          });
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-20 px-6 bg-gray-50 border-t border-gray-100"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-light text-accent text-xs font-semibold uppercase tracking-wider mb-4">
            Trusted By Thousands
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Numbers That <span className="text-accent">Speak</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Building trust through quality, safety, and customer satisfaction
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 border border-gray-100 text-center hover:border-accent/20 hover:shadow-sm transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-brand-light text-accent flex items-center justify-center mx-auto mb-3">
                {item.icon}
              </div>
              <h4 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                {index === 2
                  ? counters[index].toFixed(1)
                  : Math.floor(counters[index]).toLocaleString()}
                <span className="text-accent">{item.suffix}</span>
              </h4>
              <p className="text-sm text-gray-500 font-medium">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerTrust;
