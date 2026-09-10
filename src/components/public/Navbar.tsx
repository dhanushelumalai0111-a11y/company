import React, { useState } from 'react';
import { Shield, Phone, Mail, MapPin, Menu, X, ArrowRight, Lock, MessageSquare } from 'lucide-react';
import { CompanySettings } from '../../types.ts';
import { CompanyLogo } from '../common/CompanyLogo.tsx';

interface NavbarProps {
  settings?: CompanySettings;
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenQuote: (serviceName?: string) => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  currentTab,
  onNavigate,
  onOpenQuote,
  onOpenAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Services' },
    { id: 'clients', label: 'Clients' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900 text-white shadow-md">
      {/* Top Bar with Contact Info */}
      <div className="bg-slate-950 px-4 py-1.5 text-xs text-slate-300 border-b border-slate-800 hidden sm:block">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-5">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              Bommana Halli, Bengaluru, Karnataka, India
            </span>
            <a
              href={`tel:${settings?.phone || '+919845012345'}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              {settings?.phone || '+91 98450 12345'}
            </a>
            <a
              href={`mailto:${settings?.email || 'contact@steelmensecurity.com'}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              {settings?.email || 'contact@steelmensecurity.com'}
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <span className="bg-blue-900/60 text-blue-300 text-[11px] font-semibold px-2 py-0.5 rounded border border-blue-700/50">
              PSARA Certified & ISO 9001:2015
            </span>
            <a
              href={`https://wa.me/${(settings?.whatsapp || '919845012345').replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 text-[11px] font-medium"
            >
              <MessageSquare className="w-3 h-3" /> WhatsApp Desk
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group cursor-pointer"
            id="brand-logo-btn"
          >
            <div className="w-13 h-13 rounded-xl bg-white p-1 shadow-lg flex items-center justify-center border border-blue-500/30 group-hover:scale-105 transition-transform">
              <CompanyLogo size="md" />
            </div>
            <div>
              <span className="block font-black text-lg sm:text-xl tracking-tight text-white leading-tight">
                STEEL MAN
              </span>
              <span className="block text-[11px] tracking-widest uppercase font-extrabold text-blue-400">
                Force Security
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                id={`nav-link-${link.id}`}
                onClick={() => handleNavClick(link.id)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentTab === link.id
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Actions: Quote Button & Admin Portal */}
          <div className="hidden sm:flex items-center space-x-3">
            <button
              id="cta-get-quote-nav"
              onClick={() => onOpenQuote()}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-md shadow-sm transition-all gap-1.5 cursor-pointer"
            >
              Get a Quote
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              id="btn-admin-portal-login"
              onClick={onOpenAdmin}
              className="inline-flex items-center justify-center px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-all gap-1.5 cursor-pointer"
              title="Enter Management Dashboard"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              Admin Portal
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              id="btn-mobile-portal-icon"
              onClick={onOpenAdmin}
              className="p-2 text-slate-300 hover:text-white bg-slate-800 rounded-md"
              aria-label="Admin Portal"
            >
              <Lock className="w-4 h-4 text-amber-400" />
            </button>
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`block w-full text-left px-3 py-2.5 rounded-md text-base font-medium ${
                currentTab === link.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuote();
              }}
              className="w-full py-2.5 px-4 bg-blue-600 text-white font-semibold rounded-md text-center text-sm shadow"
            >
              Get a Free Quote
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full py-2.5 px-4 bg-slate-800 text-amber-300 border border-slate-700 font-semibold rounded-md text-center text-sm flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" /> Admin Management Dashboard
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
