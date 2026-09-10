import React from 'react';
import { Shield, Phone, Mail, MapPin, ArrowUp, Lock, CheckCircle2 } from 'lucide-react';
import { CompanySettings, ServiceItem } from '../../types.ts';
import { CompanyLogo } from '../common/CompanyLogo.tsx';

interface FooterProps {
  settings?: CompanySettings;
  services: ServiceItem[];
  onNavigate: (tab: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  services,
  onNavigate,
  onOpenAdmin,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Company Identity */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-13 h-13 rounded-xl bg-white p-1 shadow-lg flex items-center justify-center border border-blue-500/30">
                <CompanyLogo size="md" />
              </div>
              <div>
                <span className="block font-black text-lg text-white leading-tight">
                  STEEL MAN
                </span>
                <span className="block text-[11px] uppercase tracking-widest text-blue-400 font-extrabold">
                  Force Security
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed">
              {settings?.companyType ||
                'Security Services, Manpower Supply, Facility Management and Housekeeping Services.'}
            </p>

            <div className="space-y-1 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>PSARA Registered & Licensed in Karnataka</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Statutory Compliant: PF, ESI, Minimum Wages</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>100% Police Verified Workforce</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  All Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('clients')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Clients & Partners
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact & Location
                </button>
              </li>
            </ul>
          </div>

          {/* Core Services */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Key Services</h4>
            <ul className="space-y-1.5 text-xs">
              {services.slice(0, 6).map((service) => (
                <li key={service.id}>
                  <button
                    onClick={() => onNavigate('services')}
                    className="hover:text-white transition-colors text-left truncate block max-w-full cursor-pointer"
                  >
                    • {service.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details & Admin Entry */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Head Office</h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  {settings?.address || 'Bommana Halli, Bengaluru, Karnataka, India - 560068'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <a
                  href={`tel:${settings?.phone || '+919845012345'}`}
                  className="hover:text-white text-blue-300"
                >
                  {settings?.phone || '+91 98450 12345'}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a
                  href={`mailto:${settings?.email || 'contact@steelmensecurity.com'}`}
                  className="hover:text-white text-blue-300"
                >
                  {settings?.email || 'contact@steelmensecurity.com'}
                </a>
              </div>
            </div>

            <div className="pt-3">
              <button
                id="btn-footer-admin-portal"
                onClick={onOpenAdmin}
                className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                Staff / Admin Portal Login
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Steel Men Security Force. All Rights Reserved. Bommana Halli, Bengaluru.
          </div>
          <div className="flex items-center gap-6">
            <span>PSARA Compliant</span>
            <span>GST: {settings?.gstNumber || '29AABCS8891P1ZX'}</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Back to top
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
