import React, { useState } from 'react';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { ServiceItem } from '../../types.ts';
import { ServiceIcon } from '../ServiceIcon.tsx';
import { DEFAULT_SERVICES } from '../../data/defaultServices.ts';

interface ServicesSectionProps {
  services?: ServiceItem[];
  onEnquireNow?: (serviceTitle: string) => void;
  onSelectService?: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onEnquireNow,
  onSelectService,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All 11 Services' },
    { id: 'security', label: 'Security & Armed' },
    { id: 'facility', label: 'Facility & Housekeeping' },
    { id: 'manpower', label: 'Corporate Manpower' },
  ];

  const handleEnquire = (title: string) => {
    if (onEnquireNow) onEnquireNow(title);
    else if (onSelectService) onSelectService(title);
  };

  const safeServices = Array.isArray(services) && services.length > 0 ? services : DEFAULT_SERVICES;

  const filteredServices = safeServices.filter((s) => {
    if (!s) return false;
    const title = s.title || '';
    if (activeCategory === 'security') {
      return title.includes('Security') || title.includes('Gun');
    }
    if (activeCategory === 'facility') {
      return title.includes('House') || title.includes('Pool') || title.includes('Facility') || title.includes('Maintenance');
    }
    if (activeCategory === 'manpower') {
      return title.includes('Man Power') || title.includes('Driver') || title.includes('Office') || title.includes('Receptionist') || title.includes('Customized');
    }
    return true;
  });

  return (
    <section id="services-section" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Comprehensive Operational Services
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Specialized Manpower & Security Solutions
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Every team member is verified, background-screened, trained in statutory safety protocols, and equipped to uphold high corporate standards.
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => {
            const benefitsList = service.benefits
              ? service.benefits.split(',').map((b) => b.trim()).filter(Boolean)
              : [];

            return (
              <div
                key={service.id}
                id={`service-card-${service.slug}`}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1"
              >
                <div className="p-6 sm:p-7 space-y-4">
                  {/* Icon & Title */}
                  <div className="flex items-center gap-4">
                    <div className="w-13 h-13 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                      <ServiceIcon name={service.iconName} className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                        {service.title}
                      </h3>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Professional Roster
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {service.description}
                  </p>

                  {/* Key Benefits */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="text-xs font-semibold text-slate-900 mb-2">Key Service Highlights:</div>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {benefitsList.slice(0, 4).map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Footer with CTA */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    Custom Deployment Available
                  </span>
                  <button
                    id={`btn-enquire-${service.slug}`}
                    onClick={() => handleEnquire(service.title)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer"
                  >
                    Enquire Now
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
