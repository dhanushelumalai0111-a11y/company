import React from 'react';
import { Building2, Users, MapPin, CheckCircle, Shield, ArrowRight } from 'lucide-react';
import { ClientItem } from '../../types.ts';

interface ClientsShowcaseProps {
  clients: ClientItem[];
  onOpenQuote: () => void;
}

export const ClientsShowcase: React.FC<ClientsShowcaseProps> = ({
  clients,
  onOpenQuote,
}) => {
  return (
    <section id="clients-section" className="py-20 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            Trusted Corporate Partnerships
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Our Esteemed Clients in Bengaluru & Beyond
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            From premier tech parks and logistics depots to luxury residential enclaves and healthcare facilities, Steel Men Security Force is proud to be their security and facility backbone.
          </p>
        </div>

        {/* Clients Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <div
              key={client.id}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 font-black text-sm shrink-0">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle className="w-3 h-3" />
                    Active Contract
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-slate-900 leading-snug">
                    {client.companyName}
                  </h3>
                  <div className="text-xs text-blue-600 font-semibold mt-0.5">
                    {client.clientName}
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-800">Service:</span>
                    <span>{client.serviceProvided}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-800">Staff Deployed:</span>
                    <span className="font-bold text-slate-900">{client.employeesDeployed} Personnel</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{client.address}</span>
                  </div>
                </div>
              </div>

              {client.notes && (
                <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-500 italic">
                  "{client.notes}"
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Corporate Trust Strip */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-slate-900 to-blue-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold">Deploy Steel Men at Your Facility</h3>
            <p className="text-sm text-slate-300 max-w-xl">
              Schedule a comprehensive on-site vulnerability and facility audit with our senior security consultants at zero cost.
            </p>
          </div>
          <button
            onClick={onOpenQuote}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg text-sm transition-colors cursor-pointer shrink-0 flex items-center gap-2"
          >
            Get a Custom Quote
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
