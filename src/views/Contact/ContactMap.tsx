"use client";
import React from 'react';

const ContactMap = () => {
  return (
    <section className="py-16 md:py-20 px-6 bg-white border-b border-gray-100">
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="inline-block px-4 py-1.5 rounded-full bg-brand-light text-accent text-xs font-semibold uppercase tracking-wider mb-4">
          Find Us
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Visit Our <span className="text-accent">Location</span>
        </h2>
        <p className="text-gray-500">
          Come visit us in Sivakasi, Tamil Nadu — The Fireworks Capital of
          India.
        </p>
      </div>

      <div className="w-full max-w-4xl mx-auto">
        <div className="h-[300px] md:h-[400px] rounded-xl overflow-hidden border border-gray-100 shadow-sm">
          <iframe
            title="Sivakasi Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d251595.23893910547!2d77.674938!3d9.454356!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b06cf8c9179d3df%3A0xe5b5496ad3e5317c!2sSivakasi%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            allowFullScreen=""
            loading="lazy"
            className="w-full h-full border-0"
          />
        </div>
      </div>
    </section>
  );
};

export default ContactMap;
