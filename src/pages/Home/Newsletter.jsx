import React from 'react';
import { Send, Mail } from 'lucide-react';

const Newsletter = () => {
  return (
    <section className="py-16 bg-brand-light">
      <div className="container-custom mx-auto px-4 md:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-12 h-12 rounded-xl bg-white text-accent flex items-center justify-center mx-auto mb-4">
            <Mail size={22} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Stay Updated
          </h2>
          <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
            Subscribe to receive exclusive offers, new arrivals, and festive
            deals.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-accent text-white font-semibold text-sm rounded-lg hover:bg-brand-dark transition-colors flex items-center justify-center gap-2"
            >
              Subscribe <Send size={14} />
            </button>
          </form>
          <p className="text-gray-400 text-xs mt-3">
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
