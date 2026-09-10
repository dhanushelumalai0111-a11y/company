import React, { useState } from 'react';
import { MapPin, Phone, Mail, MessageSquare, Send, CheckCircle, Clock, Shield } from 'lucide-react';
import { CompanySettings } from '../../types.ts';
import { CompanyLogo } from '../common/CompanyLogo.tsx';

interface ContactSectionProps {
  settings?: CompanySettings;
  onEnquirySuccess?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  settings,
  onEnquirySuccess,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    phone: '',
    email: '',
    requiredService: 'Security Guard Services',
    numberOfStaff: 2,
    location: 'Bommana Halli, Bengaluru',
    requirementDetails: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const servicesList = [
    'Security Guard Services',
    'Man Power Supply',
    'House Keeping Services',
    'Gun Men / Armed Security Services',
    'Driver Services',
    'Office Boy Services',
    'Swimming Pool Operator Services',
    'Facility Management',
    'Receptionist Services',
    'Maintenance Staff',
    'Other customized manpower services',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/public/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit message');
      }

      setSubmitted(true);
      if (onEnquirySuccess) onEnquirySuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Submission error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact-section" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            Get In Touch
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Contact Steel Men Security Force
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Headquartered on Hosur Main Road, Bommana Halli. Reach out for immediate site audits, staffing proposals, or emergency deployments.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Contact Info & Map Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-xl space-y-6">
              <div className="flex items-center gap-3.5 border-b border-slate-800 pb-4">
                <div className="w-13 h-13 rounded-xl bg-white p-1 shadow-md flex items-center justify-center border border-blue-400/40 shrink-0">
                  <CompanyLogo size="sm" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Central Operations Office</h3>
                  <p className="text-xs text-blue-400 font-semibold">Steel Man Force Security • Bommana Halli</p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Registered Address:</span>
                    <span>
                      {settings?.address || '#42, 2nd Floor, Hosur Main Road, Bommana Halli, Bengaluru, Karnataka, India - 560068'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white block">Hotline Phone:</span>
                    <a
                      href={`tel:${settings?.phone || '+919845012345'}`}
                      className="text-blue-300 hover:text-white transition-colors"
                    >
                      {settings?.phone || '+91 98450 12345'}
                    </a>
                    {settings?.altPhone && (
                      <span className="text-xs text-slate-400 block">{settings.altPhone}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white block">Official Email:</span>
                    <a
                      href={`mailto:${settings?.email || 'contact@steelmensecurity.com'}`}
                      className="text-blue-300 hover:text-white transition-colors"
                    >
                      {settings?.email || 'contact@steelmensecurity.com'}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white block">Control Room Hours:</span>
                    <span>24 Hours / 7 Days / 365 Days</span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Action */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/${(settings?.whatsapp || '919845012345').replace(/[^0-9]/g, '')}?text=Hello%20Steel%20Men%20Security%20Force,%20I%20would%20like%20to%20enquire%20about%20your%20services.`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer text-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  Chat Directly on WhatsApp
                </a>
              </div>
            </div>

            {/* Google Map Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  Location: Bommana Halli, Bengaluru
                </span>
                <a
                  href="https://maps.google.com/?q=Bommanahalli,+Bengaluru,+Karnataka"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Open in Maps ↗
                </a>
              </div>

              {/* Embedded Interactive Map Frame */}
              <div className="w-full h-56 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative">
                <iframe
                  title="Steel Men Security Force Location"
                  className="w-full h-full border-0"
                  src="https://maps.google.com/maps?q=Bommanahalli,%20Bengaluru&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Right: Quick Enquiry / Quote Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-8 sm:p-10 border border-slate-200 shadow-xl space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Send an Enquiry / Request a Quote</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Fill out your staffing requirements below. Our operations supervisor will connect within 30 minutes.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-emerald-900">Enquiry Received Successfully!</h4>
                  <p className="text-sm text-emerald-700 max-w-md mx-auto">
                    Thank you for reaching out to Steel Men Security Force. Your request has been logged in our central operations dashboard, and our senior deployment manager will contact you shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        companyName: '',
                        phone: '',
                        email: '',
                        requiredService: 'Security Guard Services',
                        numberOfStaff: 2,
                        location: 'Bommana Halli, Bengaluru',
                        requirementDetails: '',
                      });
                    }}
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Anand Sharma"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Company / Society Name
                      </label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        placeholder="e.g. Apex Tech Solutions Ltd."
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. +91 98450 00000"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. facility@company.com"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Required Service *
                      </label>
                      <select
                        value={formData.requiredService}
                        onChange={(e) => setFormData({ ...formData, requiredService: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                      >
                        {servicesList.map((s, idx) => (
                          <option key={idx} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Number of Staff Required
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="200"
                        value={formData.numberOfStaff}
                        onChange={(e) => setFormData({ ...formData, numberOfStaff: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Deployment Location in Bengaluru / Karnataka
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Electronic City, Bommanahalli, Whitefield, HSR Layout"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Requirement Details & Shifts Needed
                    </label>
                    <textarea
                      rows={3}
                      value={formData.requirementDetails}
                      onChange={(e) => setFormData({ ...formData, requirementDetails: e.target.value })}
                      placeholder="Please specify shift requirements (Day/Night/24-7), premises square footage, or any specific security gear..."
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                  >
                    {loading ? 'Submitting Request...' : 'Submit Enquiry & Get Free Quote'}
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
