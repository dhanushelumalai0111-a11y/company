import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  User,
  Trash2,
  Filter,
  Eye,
  X
} from 'lucide-react';
import { EnquiryItem } from '../../types.ts';

interface EnquiryManagementProps {
  enquiries: EnquiryItem[];
  onRefresh: () => void;
}

export const EnquiryManagement: React.FC<EnquiryManagementProps> = ({
  enquiries = [],
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewingEnquiry, setViewingEnquiry] = useState<EnquiryItem | null>(null);

  const safeEnquiries = Array.isArray(enquiries) ? enquiries : [];

  const filteredEnquiries = safeEnquiries.filter((enq) => {
    if (!enq) return false;
    const search = searchTerm.toLowerCase();
    const srv = (enq.requiredService || enq.serviceRequired || '').toLowerCase();
    const name = (enq.name || '').toLowerCase();
    const phone = (enq.phone || '');
    const comp = (enq.companyName || '').toLowerCase();
    const matchesSearch =
      name.includes(search) ||
      phone.includes(search) ||
      comp.includes(search) ||
      srv.includes(search);
    const matchesStatus = filterStatus === 'all' || enq.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (id: number, status: 'New' | 'Contacted' | 'Converted' | 'Closed') => {
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) onRefresh();
    } catch (e) {
      alert('Error updating enquiry');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this enquiry?')) return;
    try {
      const res = await fetch(`/api/enquiries/${id}`, { method: 'DELETE' });
      if (res.ok) onRefresh();
    } catch (e) {
      alert('Error deleting enquiry');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Client Quotation & Inquiries</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Leads received from website booking forms, manpower requests, and armed security tenders.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by prospect name, phone, company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
          >
            <option value="all">All Inquiries ({safeEnquiries.length})</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Converted">Converted</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Prospect / Organization</th>
                <th className="py-3.5 px-4">Contact Details</th>
                <th className="py-3.5 px-4">Service Needed</th>
                <th className="py-3.5 px-4">Manpower Qty</th>
                <th className="py-3.5 px-4">Lead Status</th>
                <th className="py-3.5 px-4">Received Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No client inquiries found.
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">{enq.name}</div>
                      {enq.companyName && (
                        <div className="text-[11px] text-blue-600 font-semibold">{enq.companyName}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <a href={`tel:${enq.phone}`} className="hover:underline">{enq.phone}</a>
                      </div>
                      {enq.email && (
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <a href={`mailto:${enq.email}`} className="hover:underline">{enq.email}</a>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {enq.serviceRequired}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900">{enq.numberOfPersonnel || 1} Staff</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={enq.status}
                        onChange={(e) => handleUpdateStatus(enq.id, e.target.value as any)}
                        className={`text-[11px] font-bold px-2 py-1 rounded-full border ${
                          enq.status === 'New'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : enq.status === 'Contacted'
                            ? 'bg-sky-50 text-sky-700 border-sky-200'
                            : enq.status === 'Converted'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border-slate-300'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Converted">Converted</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => setViewingEnquiry(enq)}
                        title="View Enquiry Message"
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(enq.id)}
                        title="Delete Enquiry"
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Message Modal */}
      {viewingEnquiry && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-lg text-slate-900">{viewingEnquiry.name}</h3>
                <p className="text-xs text-blue-600 font-semibold">{viewingEnquiry.companyName || 'Individual'}</p>
              </div>
              <button onClick={() => setViewingEnquiry(null)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div>
                <strong className="text-slate-900">Phone:</strong> {viewingEnquiry.phone}
              </div>
              <div>
                <strong className="text-slate-900">Email:</strong> {viewingEnquiry.email || 'N/A'}
              </div>
              <div>
                <strong className="text-slate-900">Service Required:</strong> {viewingEnquiry.serviceRequired}
              </div>
              <div>
                <strong className="text-slate-900">Required Staff:</strong> {viewingEnquiry.numberOfPersonnel || 1}
              </div>
              <div className="pt-2">
                <strong className="text-slate-900 block mb-1">Requirement Notes:</strong>
                <div className="p-3 bg-slate-50 rounded-lg border text-slate-600 leading-relaxed italic">
                  "{viewingEnquiry.message || 'No additional specifications provided.'}"
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t">
              <a
                href={`tel:${viewingEnquiry.phone}`}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" /> Call Client Now
              </a>
              <button
                onClick={() => setViewingEnquiry(null)}
                className="px-4 py-2 border rounded-lg text-slate-600 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
