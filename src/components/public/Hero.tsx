import React from 'react';
import { ShieldCheck, PhoneCall, ArrowRight, Award, CheckCircle, Users, Building, Calendar } from 'lucide-react';
import { CompanySettings } from '../../types.ts';
import { CompanyLogo } from '../common/CompanyLogo.tsx';

interface HeroProps {
  settings?: CompanySettings;
  stats?: {
    experiencedStaff: number;
    securityPersonnel: number;
    clientsServed: number;
    yearsOfExperience: number;
  };
  onOpenQuote: () => void;
  onContactClick: () => void;
  onExploreServices: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  stats,
  onOpenQuote,
  onContactClick,
  onExploreServices,
}) => {
  return (
    <div className="relative bg-slate-900 text-white overflow-hidden">
      {/* Background Subtle Gradient & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-slate-700/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex flex-wrap items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-white p-1 shadow-xl border border-blue-400/40 flex items-center justify-center shrink-0">
                <CompanyLogo size="md" />
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-blue-950/90 border border-blue-600/40 text-blue-300 text-xs font-semibold shadow-inner">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>PSARA Compliant Security & Verified Manpower Force</span>
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Steel Men <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-blue-500">
                  Security Force
                </span>
              </h1>
              <p className="text-xl sm:text-2xl font-medium text-slate-200">
                {settings?.tagline || 'Reliable Security & Manpower Solutions'}
              </p>
              <p className="text-slate-400 text-base sm:text-lg max-w-2xl leading-relaxed">
                Headquartered in Bommana Halli, Bengaluru. We protect high-value assets, corporate IT parks, luxury residential communities, and industrial warehouses with disciplined armed and unarmed security guards, certified facility technicians, and vetted manpower.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                id="hero-cta-get-quote"
                onClick={onOpenQuote}
                className="px-7 py-3.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer text-base"
              >
                Get a Quote
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                id="hero-cta-contact-us"
                onClick={onContactClick}
                className="px-6 py-3.5 bg-slate-800/90 hover:bg-slate-700 text-white font-semibold rounded-lg border border-slate-700 flex items-center gap-2 transition-all cursor-pointer text-base"
              >
                <PhoneCall className="w-4 h-4 text-blue-400" />
                Contact Us
              </button>

              <button
                id="hero-cta-explore-services"
                onClick={onExploreServices}
                className="px-4 py-3.5 text-slate-400 hover:text-white font-medium text-sm transition-colors cursor-pointer"
              >
                Explore All 11 Services →
              </button>
            </div>

            {/* Quality Checklist */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Police Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>24/7 Rapid Response</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Deployment Delay</span>
              </div>
            </div>
          </div>

          {/* Hero Right Visual Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-gradient-to-b from-slate-800/80 to-slate-900/90 border border-slate-700/80 p-6 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-slate-700 pb-4 mb-6">
                <div>
                  <div className="text-xs uppercase tracking-wider font-semibold text-blue-400">
                    Operational Readiness
                  </div>
                  <div className="text-lg font-bold text-white">Bengaluru Command & Patrol</div>
                </div>
                <div className="flex items-center gap-1 bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 px-2.5 py-1 rounded-full text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active Roster
                </div>
              </div>

              {/* Roster highlight items */}
              <div className="space-y-3.5">
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white p-0.5 flex items-center justify-center border border-blue-500/50 shadow-sm shrink-0">
                      <CompanyLogo size="xs" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Armed & Unarmed Guarding</div>
                      <div className="text-xs text-slate-400">Electronic City, Bommanahalli, HSR</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-950 text-blue-300 border border-blue-800">
                    24/7 Patrol
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-900/50 flex items-center justify-center border border-indigo-700/50 text-indigo-400 font-bold">
                      FM
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Facility & Pool Operations</div>
                      <div className="text-xs text-slate-400">Deep sanitization & plant operation</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                    Certified
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-sky-900/50 flex items-center justify-center border border-sky-700/50 text-sky-400 font-bold">
                      MP
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Corporate Manpower & Drivers</div>
                      <div className="text-xs text-slate-400">Office boys, receptionists, technicians</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-sky-950 text-sky-300 border border-sky-800">
                    Vetted
                  </span>
                </div>
              </div>

              {/* Direct Call Hotline Card */}
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-blue-900/40 to-slate-800/40 border border-blue-500/30 flex items-center justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                    Instant Deployment Helpline
                  </div>
                  <a
                    href={`tel:${settings?.phone || '+919845012345'}`}
                    className="text-base font-bold text-blue-300 hover:text-white transition-colors"
                  >
                    {settings?.phone || '+91 98450 12345'}
                  </a>
                </div>
                <a
                  href={`tel:${settings?.phone || '+919845012345'}`}
                  className="p-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-colors"
                  aria-label="Call Steel Men Security Force"
                >
                  <PhoneCall className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Bar */}
        <div className="mt-16 pt-8 border-t border-slate-800/80">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
            <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-800">
              <div className="flex items-center gap-2 justify-center sm:justify-start text-blue-400 mb-1">
                <Users className="w-5 h-5" />
                <span className="text-xs font-semibold tracking-wide uppercase">Experienced Staff</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white">
                {stats?.experiencedStaff || 150}+
              </div>
              <p className="text-xs text-slate-400 mt-1">Disciplined & inducted workforce</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-800">
              <div className="flex items-center gap-2 justify-center sm:justify-start text-blue-400 mb-1">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-xs font-semibold tracking-wide uppercase">Security Personnel</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white">
                {stats?.securityPersonnel || 70}+
              </div>
              <p className="text-xs text-slate-400 mt-1">Armed & unarmed guards on duty</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-800">
              <div className="flex items-center gap-2 justify-center sm:justify-start text-blue-400 mb-1">
                <Building className="w-5 h-5" />
                <span className="text-xs font-semibold tracking-wide uppercase">Clients Served</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white">
                {stats?.clientsServed || 45}+
              </div>
              <p className="text-xs text-slate-400 mt-1">Tech parks, societies & hospitals</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-800">
              <div className="flex items-center gap-2 justify-center sm:justify-start text-blue-400 mb-1">
                <Calendar className="w-5 h-5" />
                <span className="text-xs font-semibold tracking-wide uppercase">Years of Experience</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white">
                {stats?.yearsOfExperience || 14}+
              </div>
              <p className="text-xs text-slate-400 mt-1">Unbroken track record in Karnataka</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
