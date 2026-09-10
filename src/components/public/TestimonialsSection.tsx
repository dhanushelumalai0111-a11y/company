import React from 'react';
import { Star, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote:
        'Steel Men Security Force has handled our 45-acre IT park perimeter and ingress gates in Electronic City with clockwork precision. Their night guard audit reports and polite front gate management give our tenant companies complete peace of mind.',
      author: 'Vikram Reddy',
      role: 'Head of Infrastructure & Facilities',
      company: 'Prestige Estates Projects Ltd, Bengaluru',
      rating: 5,
    },
    {
      quote:
        'Managing 450 residential apartments requires patient security personnel and skilled swimming pool operators. Steel Men provided us with certified pool technicians and disciplined guards who are exceptionally courteous with families.',
      author: 'Mrs. Shalini Rao',
      role: 'President, Management Committee',
      company: 'Brigade Millennium Enclave, JP Nagar',
      rating: 5,
    },
    {
      quote:
        'We deal with high-value cargo and transit operations at our Bommanahalli hub. Steel Men’s armed ex-servicemen personnel maintain flawless dock vigilance and material vehicle logging. Highly recommended for commercial security.',
      author: 'Karthik Sen',
      role: 'Senior Operations Director',
      company: 'Infosys BPM Logistics Hub',
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-700/50 text-blue-300 text-xs font-bold uppercase tracking-wider">
            Client Endorsements
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Trusted by Bengaluru’s Leading Enterprises
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Hear from our corporate facility heads, residential association presidents, and logistics executives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-slate-800/80 border border-slate-700 p-8 flex flex-col justify-between space-y-6 relative"
            >
              <Quote className="w-10 h-10 text-blue-500/20 absolute top-6 right-6" />

              <div className="space-y-4">
                <div className="flex gap-1 text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="border-t border-slate-700/80 pt-4">
                <div className="font-bold text-white text-base">{t.author}</div>
                <div className="text-xs text-blue-400 font-medium">{t.role}</div>
                <div className="text-xs text-slate-400 mt-0.5">{t.company}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
