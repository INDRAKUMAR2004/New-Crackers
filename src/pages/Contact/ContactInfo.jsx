import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const ContactInfo = () => {
  const items = [
    { icon: Mail, title: 'Email', info: 'support@example.com' },
    { icon: Phone, title: 'Phone', info: '+91 90000 00000' },
    { icon: MapPin, title: 'Location', info: 'Chennai, Tamil Nadu' },
    {
      icon: Clock,
      title: 'Business Hours',
      info: 'Mon–Sat: 9:00 AM – 8:00 PM',
    },
  ];

  return (
    <section className="py-16 md:py-20 px-6 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-light text-accent text-xs font-semibold uppercase tracking-wider mb-4">
            Contact Details
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Ways to <span className="text-accent">Reach Us</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Choose your preferred method of communication. We're always happy to
            help.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item, i) => (
            <div
              key={i}
              className="bg-gray-50 border border-gray-100 rounded-xl p-6 text-center hover:border-accent/20 hover:shadow-sm transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-brand-light text-accent flex items-center justify-center mx-auto mb-3">
                <item.icon size={20} />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
              <p className="text-sm text-gray-500">{item.info}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
