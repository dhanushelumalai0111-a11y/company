import React from 'react';
import { Shield, Target, Eye, HeartHandshake, CheckCircle2, Award, FileCheck2, UserCheck } from 'lucide-react';
import { CompanySettings } from '../../types.ts';
import { CompanyLogo } from '../common/CompanyLogo.tsx';

interface AboutSectionProps {
  settings?: CompanySettings;
  onOpenQuote: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  settings,
  onOpenQuote,
}) => {
  return (
    <section id="about-section" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider">
              About Steel Men Security Force
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              A Legacy of Discipline, Vigilance & Trust in Karnataka
            </h2>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              Founded and operating from Bommana Halli, Bengaluru, <strong>Steel Men Security Force</strong> has established itself as one of the premier security and corporate manpower providers across Southern India.
            </p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              We specialize in delivering integrated security defense, facility management, armed security escorts, commercial housekeeping, and skilled manpower to multinational IT companies, pharmaceutical facilities, residential complexes, and logistics hubs.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 text-sm">Strict Statutory Compliance</span>
                  <p className="text-xs text-slate-500">100% compliant with PSARA regulations, Minimum Wages Act, PF, ESI, and GST filings.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 text-sm">Unbroken Background Audits</span>
                  <p className="text-xs text-slate-500">Local police verification, address scrutiny, and past employment validation for every recruit.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 text-sm">Surprise Night Patrols</span>
                  <p className="text-xs text-slate-500">Dedicated field operational supervisors conducting random night audits with digital RFID wand logs.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={onOpenQuote}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-sm shadow transition-colors cursor-pointer"
              >
                Request Deployment Proposal
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900 text-white p-8 space-y-6">
              <div className="flex items-center gap-3.5 border-b border-slate-800 pb-4">
                <div className="w-12 h-12 rounded-xl bg-white p-1 shadow-md flex items-center justify-center border border-blue-400/40 shrink-0">
                  <CompanyLogo size="sm" />
                </div>
                <div>
                  <div className="text-base font-bold text-white">Steel Man Force Security Standard</div>
                  <div className="text-xs text-blue-400">Excellence in Guarding & Manpower Supply</div>
                </div>
              </div>

              <div className="space-y-4 text-sm text-slate-300">
                <p>
                  We understand that security and facility upkeep are not merely line items—they safeguard your enterprise reputation, human life, and multimillion-rupee corporate assets.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                    <div className="text-2xl font-black text-blue-400">100%</div>
                    <div className="text-xs font-semibold text-white mt-1">Police Cleared Staff</div>
                    <div className="text-[11px] text-slate-400">Documented crime record checks</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                    <div className="text-2xl font-black text-blue-400">&lt; 24h</div>
                    <div className="text-xs font-semibold text-white mt-1">Replacement Guarantee</div>
                    <div className="text-[11px] text-slate-400">Zero absenteeism impact</div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-950/60 border border-blue-800/50 text-xs text-blue-200">
                <span className="font-bold text-blue-300">HQ Address:</span> #42, 2nd Floor, Hosur Main Road, Bommana Halli, Bengaluru, Karnataka, India - 560068
              </div>
            </div>
          </div>
        </div>

        {/* Mission, Vision, Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Our Mission</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              To deliver uncompromising security defense and meticulously trained manpower that empowers organizations and residential communities to thrive in a safe, hygienic, and productive environment.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Our Vision</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              To be the most reliable, disciplined, and technologically transparent manpower and security force in Southern India, recognized for integrity, employee welfare, and zero operational lapses.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Our Core Values</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              <strong>Vigilance:</strong> Unceasing alertness. <br />
              <strong>Integrity:</strong> Honesty in audits and billing. <br />
              <strong>Discipline:</strong> Military-grade punctuality. <br />
              <strong>Reliability:</strong> Guaranteed replacements.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
