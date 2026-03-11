import React from 'react';
import { Send, Sparkles } from 'lucide-react';

const Newsletter = () => {
  return (
    <section className="py-20 relative overflow-hidden font-body">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-red-500 to-orange-600"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>

      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container-custom mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="lg:w-1/2 text-white">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm text-white/90 text-xs font-semibold tracking-[0.15em] uppercase mb-5">
            <Sparkles size={14} className="animate-pulse" />
            Stay Updated
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight tracking-tight">
            Get Exclusive Offers & <br /> Festive Updates
          </h2>
          <p className="text-white/70 text-base md:text-lg max-w-md leading-relaxed">
            Subscribe to our newsletter for new arrivals, flash sales, and
            safety tips for your celebrations.
          </p>
        </div>

        <div className="lg:w-1/2 w-full max-w-lg">
          <form className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/15 flex flex-col sm:flex-row gap-2 shadow-2xl">
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full bg-transparent text-white placeholder-white/40 px-6 py-4 outline-none text-base font-medium"
              required
            />
            <button
              type="submit"
              className="bg-white text-orange-600 font-bold px-8 py-4 rounded-xl hover:bg-orange-50 transition-all flex items-center justify-center gap-2 group shadow-lg whitespace-nowrap"
            >
              <span>Subscribe</span>
              <Send
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </form>
          <p className="text-white/40 text-xs font-medium mt-4 text-center sm:text-left">
            *We respect your privacy. No spam, ever.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
