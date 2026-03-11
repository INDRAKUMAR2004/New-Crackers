import React from 'react';
import ContactBanner from './ContactBanner';
import ContactInfo from './ContactInfo';
import ContactForm from './ContactForm';
import ContactMap from './ContactMap';

const ContactPage = () => {
  return (
    <div className="pt-16 bg-white">
      <ContactBanner />
      <ContactInfo />
      <ContactForm />
      <ContactMap />
    </div>
  );
};

export default ContactPage;
