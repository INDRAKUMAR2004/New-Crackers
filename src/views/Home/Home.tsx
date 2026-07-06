"use client";
import React from 'react';
import Hero from './Hero';
import Categories from './Categories';
import BestSellers from './BestSellers';
import Testimonials from './Testimonials';
import NewArrivalsPreview from './NewArrivalsPreview';
import CollectionsByOccasion from './CollectionsByOccasion';
import TrustBadges from './TrustBadges';
import Newsletter from './Newsletter';

const Home = () => {
  return (
    <div className="w-full bg-white pt-16">
      <Hero />
      <TrustBadges />
      <Categories />
      <BestSellers />
      <NewArrivalsPreview />
      <CollectionsByOccasion />
      <Testimonials />
      <Newsletter />
    </div>
  );
};

export default Home;
