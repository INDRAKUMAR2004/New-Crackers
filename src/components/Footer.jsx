import React from 'react';
import {
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  MessageCircle,
  ArrowRight,
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
    <footer className="bg-gray-50 pt-16 pb-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          {/* Brand Column */}
          <div className="space-y-5">
            <Link to="/" className="inline-block">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                Dheeran <span className="text-accent">Crackers</span>
              </h2>
            </Link>
            <p className="text-gray-500 leading-relaxed text-sm pr-4">
              Premium fireworks for your special celebrations. We deliver joy,
              safety, and spectacular moments directly to your doorstep.
            </p>

            <div className="flex gap-2.5">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-white border border-gray-200 text-gray-500 hover:bg-accent hover:text-white hover:border-accent transition-all duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-5">
              Explore
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.path}
                    className="text-gray-500 hover:text-accent transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-5">
              Support
            </h3>
            <ul className="space-y-2.5">
              {supportLinks.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.path}
                    className="text-gray-500 hover:text-accent transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-5">
              Contact Us
            </h3>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-light text-accent flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={16} />
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  123 Firework Street, Sivakasi,
                  <br />
                  Tamil Nadu - 626123
                </p>
              </div>

              <a
                href="tel:+919876543210"
                className="flex items-center gap-3 group"
              >
                <div className="w-8 h-8 rounded-lg bg-brand-light text-accent flex items-center justify-center shrink-0">
                  <Phone size={16} />
                </div>
                <span className="text-gray-600 font-medium text-sm group-hover:text-accent transition-colors">
                  +91 98765 43210
                </span>
              </a>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                Subscribe to offers
              </h4>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email address"
                  className="flex-1 min-w-0 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all placeholder:text-gray-400 text-gray-900"
                />
                <button className="bg-accent text-white px-3 py-2 rounded-lg hover:bg-brand-dark transition-colors shrink-0">
                  <ArrowRight size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400 flex items-center gap-1">
            &copy; {currentYear} Dheeran Crackers.
          </p>
          <div className="flex items-center gap-5">
            <Link
              to="#"
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="#"
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
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
