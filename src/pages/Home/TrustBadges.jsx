import React from 'react';
import { ShieldCheck, Truck, Clock, CreditCard } from 'lucide-react';

const TrustBadges = () => {
  const features = [
    {
      icon: <ShieldCheck size={28} />,
      title: '100% Safe',
      desc: 'Licensed & Certified Fireworks',
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
    },
    {
      icon: <Truck size={28} />,
      title: 'Fast Delivery',
      desc: 'Pan-India Shipping Available',
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
    },
    {
      icon: <Clock size={28} />,
      title: '24/7 Support',
      desc: 'Dedicated Customer Care',
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
    },
    {
      icon: <CreditCard size={28} />,
      title: 'Secure Payment',
      desc: '100% Secure Transactions',
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
    },
  ];

  return (
    <div className="py-12 bg-slate-900">
      <section className="relative z-20 container-custom mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] p-5 md:p-6 rounded-2xl
              flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left
              gap-3 md:gap-4 hover:border-orange-500/20 hover:bg-white/[0.05] transition-all duration-500 group"
            >
              <div
                className={`p-3 ${feature.bg} rounded-xl ${feature.color} group-hover:scale-110 transition-transform duration-300`}
              >
                {feature.icon}
              </div>
              <div>
                <h3 className="text-white font-bold text-sm md:text-base">
                  {feature.title}
                </h3>
                <p className="text-slate-500 text-xs md:text-sm">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TrustBadges;
