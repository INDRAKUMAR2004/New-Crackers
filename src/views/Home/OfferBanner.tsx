"use client";
import React from "react";
import banner from "../../assets/banner.jpg";

import { Link } from "react-router-dom";

export default function OfferBanner() {
  return (
    <section className="w-full px-10 py-5 font-family">
      <div className="relative w-full rounded-2xl overflow-hidden shadow-lg">

        {/* Background Image */}
        <img
          src={banner}
          alt="Offer Banner"
          className="w-full h-[450px] object-cover"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">

          {/* OFFER PILL */}
          <span className="px-4 py-1.5 text-xs font-semibold bg-amber-100 border-2 
         border-amber-900  text-amber-900 rounded-full shadow-sm tracking-wider uppercase 
          animate-pulse-slow">
            Limited Time Offer
          </span>

          {/* TITLE */}
          <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
            Diwali Mega Sale
          </h1>

          {/* SUBTITLE */}
          <p className="mt-3 text-white/90 text-sm sm:text-base max-w-xl leading-relaxed">
            Get up to <span className="font-bold text-amber-300">20% OFF</span> on all categories.
            Make this Diwali brighter and safer with premium cracker deals.
          </p>

          {/* BUTTON */}
         <Link to="/products">
  <button
    className="mt-6 bg-amber-400 hover:bg-amber-300 text-amber-900 font-semibold
    px-6 py-2 rounded-full shadow-lg transition-all duration-200"
    onClick={() =>
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }
  >
    Shop the Offer →
  </button>
</Link>
        </div>
      </div>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.05); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
      `}</style>
    </section>
  );
}
