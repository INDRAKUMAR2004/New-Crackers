import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  MessageCircle,
  ArrowRight,
  Heart,
  Send,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <Facebook size={18} />, href: '#', label: 'Facebook' },
    { icon: <Instagram size={18} />, href: '#', label: 'Instagram' },
    { icon: <Twitter size={18} />, href: '#', label: 'Twitter' },
    { icon: <MessageCircle size={18} />, href: '#', label: 'WhatsApp' },
  ];

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop All', path: '/products' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Admin Login', path: '/admin-login' },
  ];

  const supportLinks = [
    { name: 'FAQs', path: '#' },
    { name: 'Shipping Policy', path: '#' },
    { name: 'Returns & Refunds', path: '#' },
    { name: 'Terms & Conditions', path: '#' },
    { name: 'Privacy Policy', path: '#' },
  ];

  return (
    <footer className="bg-slate-900 font-sans pt-16 pb-8 relative overflow-hidden">
      {/* Decorative accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-14">
          {/* Brand Column */}
          <div className="space-y-5">
            <Link to="/" className="inline-block group">
              <h2 className="text-2xl font-black text-white tracking-tight group-hover:opacity-80 transition-opacity">
                Dheeran <span className="text-orange-500">Crackers</span>
              </h2>
            </Link>
            <p className="text-slate-400 leading-relaxed text-sm pr-4">
              Premium fireworks for your special celebrations. We deliver joy,
              safety, and spectacular moments directly to your doorstep.
            </p>

            <div className="flex gap-2.5">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-slate-400 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-300 hover:-translate-y-0.5"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-6">
              Explore
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-slate-400 hover:text-orange-400 transition-colors text-sm group"
                  >
                    <ArrowRight
                      size={12}
                      className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                    />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-6">
              Support
            </h3>
            <ul className="space-y-3">
              {supportLinks.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.path}
                    className="flex items-center gap-2 text-slate-400 hover:text-orange-400 transition-colors text-sm group"
                  >
                    <ArrowRight
                      size={12}
                      className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                    />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-6">
              Contact Us
            </h3>

            <div className="space-y-4 mb-6">
              <a
                href="#"
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    123 Firework Street, Sivakasi,
                    <br />
                    Tamil Nadu - 626123
                  </p>
                </div>
              </a>

              <a
                href="tel:+919876543210"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Phone size={16} />
                </div>
                <span className="text-slate-400 font-semibold text-sm group-hover:text-blue-400 transition-colors">
                  +91 98765 43210
                </span>
              </a>
            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <h4 className="text-xs font-bold text-white mb-2">
                Subscribe to offers
              </h4>
              <form className="flex gap-2 relative">
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-3 pr-10 py-2.5 text-xs font-medium outline-none focus:border-orange-500/50 transition-all placeholder:text-slate-500 text-white"
                />
                <button className="absolute right-1 top-1 bottom-1 bg-orange-500 text-white p-1.5 rounded-md hover:bg-orange-600 transition-colors">
                  <ArrowRight size={14} />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-medium text-slate-500 flex items-center gap-1">
            &copy; {currentYear} Dheeran Crackers. Made with{' '}
            <Heart size={12} className="text-rose-500 fill-rose-500" /> in
            India.
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="#"
              className="text-xs font-medium text-slate-500 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="#"
              className="text-xs font-medium text-slate-500 hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
