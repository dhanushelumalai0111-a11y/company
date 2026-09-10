import React from 'react';
import { ShieldAlert, Clock, Award, FileText, CheckCircle, RefreshCw, Cpu, UserCheck } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const points = [
    {
      icon: <ShieldAlert className="w-6 h-6 text-blue-600" />,
      title: '24/7 Rapid Response Control Room',
      description: 'Centralized round-the-clock emergency support desk with standby mobile patrol vans stationed across Bengaluru.',
    },
    {
      icon: <UserCheck className="w-6 h-6 text-blue-600" />,
      title: '100% Police Verified & Trained',
      description: 'Rigorous vetting, local police station verification, physical fitness drills, and fire-fighting emergency training.',
    },
    {
      icon: <RefreshCw className="w-6 h-6 text-blue-600" />,
      title: 'Zero-Downtime Replacement Guarantee',
      description: 'Guaranteed qualified replacement personnel dispatched within 2 to 4 hours in case of sudden absenteeism or leave.',
    },
    {
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      title: 'Flawless Statutory Compliance',
      description: 'Strict adherence to PF, ESI, Minimum Wages Act, Bonus, and GST regulations. Comprehensive monthly compliance dossiers provided.',
    },
    {
      icon: <Cpu className="w-6 h-6 text-blue-600" />,
      title: 'Digital Guard Tour & Wand Auditing',
      description: 'RFID checkpoint logging during night rounds ensures 100% perimeter surveillance with supervisor verification reports.',
    },
    {
      icon: <Clock className="w-6 h-6 text-blue-600" />,
      title: 'Experienced Ex-Servicemen Leadership',
      description: 'Founded and managed by experienced defense and paramilitary personnel who bring military discipline to civilian security.',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold uppercase tracking-wider">
            Why Steel Men
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Engineered for Precision, Protection & Discipline
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            We don't just supply uniforms; we supply accountable professionals who represent your organization with pride and absolute alertness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {points.map((point, index) => (
            <div
              key={index}
              className="p-7 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-white hover:shadow-lg transition-all space-y-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                {point.icon}
              </div>
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                {point.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
