import { Phone, Mail, MessageSquare } from 'lucide-react';
import bgImg from '../../assets/contactbanner.jpg';

const ContactBanner = () => {
  return (
    <div className="relative w-full py-20 md:py-28 px-6 overflow-hidden bg-gray-50 border-b border-gray-100">
      <img
        src={bgImg}
        alt="Contact Banner"
        className="absolute inset-0 w-full h-full object-cover opacity-10"
      />
      <div className="absolute inset-0 bg-white/70" />

      <div className="relative text-center max-w-2xl mx-auto z-10">
        <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-semibold border border-gray-200 bg-white uppercase tracking-widest text-gray-500 mb-5">
          We're Here To Help
        </span>

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
          Get in <span className="text-accent">Touch</span>
        </h2>

        <p className="text-base text-gray-500 max-w-xl mx-auto leading-relaxed mb-10">
          Have questions? We'd love to hear from you. Send us a message and
          we'll respond as soon as possible.
        </p>

        <div className="flex items-center justify-center gap-4">
          {[Phone, Mail, MessageSquare].map((Icon, i) => (
            <div
              key={i}
              className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:border-accent hover:text-accent text-gray-400 transition-colors cursor-pointer"
            >
              <Icon size={20} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactBanner;
