import React from 'react';
import contactSide from '../../assets/contact-side.jpg';

const ContactForm = () => {
  return (
    <section className="py-16 md:py-20 px-6 bg-gray-50 border-t border-gray-100">
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="inline-block px-4 py-1.5 rounded-full bg-brand-light text-accent text-xs font-semibold uppercase tracking-wider mb-4">
          Send Message
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Let's Start a <span className="text-accent">Conversation</span>
        </h2>
        <p className="text-gray-500">
          Fill out the form below and we'll get back to you within 24 hours.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left - Image */}
        <div className="relative rounded-xl overflow-hidden border border-gray-100 min-h-[400px]">
          <img
            src={contactSide}
            alt="Why Choose Us"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 text-white">
            <h3 className="text-xl font-bold mb-4">Why Choose Us?</h3>
            <ul className="space-y-2 text-sm">
              {[
                'Quick Response Time',
                'Expert Guidance',
                '100% Customer Satisfaction',
                'Secure & Confidential',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right - Form */}
        <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
          <form className="grid grid-cols-1 gap-5">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                Your Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10 text-sm text-gray-800 placeholder-gray-400 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                Your Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10 text-sm text-gray-800 placeholder-gray-400 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="Enter phone number"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10 text-sm text-gray-800 placeholder-gray-400 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                Message
              </label>
              <textarea
                rows="4"
                placeholder="Write your message..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10 text-sm text-gray-800 placeholder-gray-400 transition-all resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-accent text-white py-3 rounded-lg font-semibold hover:bg-brand-dark transition-colors text-sm"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
