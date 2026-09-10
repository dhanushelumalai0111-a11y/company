import React, { useState } from 'react';
import {
  ReceiptText,
  Plus,
  Search,
  Printer,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
  Save,
  Shield,
  FileDown
} from 'lucide-react';
import { InvoiceItem, ClientItem, CompanySettings } from '../../types.ts';
import { CompanyLogo } from '../common/CompanyLogo.tsx';

interface InvoiceManagementProps {
  invoices: InvoiceItem[];
  clients: ClientItem[];
  settings?: CompanySettings;
  onRefresh: () => void;
}

export const InvoiceManagement: React.FC<InvoiceManagementProps> = ({
  invoices = [],
  clients = [],
  settings,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewingInvoice, setViewingInvoice] = useState<InvoiceItem | null>(null);
  const [loading, setLoading] = useState(false);

  const safeClients = Array.isArray(clients) ? clients : [];
  const safeInvoices = Array.isArray(invoices) ? invoices : [];

  const [formData, setFormData] = useState({
    clientId: safeClients[0]?.id || 1,
    invoiceNumber: `SMSF-INV-${Date.now().toString().slice(-6)}`,
    invoiceDate: new Date().toISOString().split('T')[0],
    billingPeriod: 'September 2026',
    serviceDescription: 'Armed Guarding, Perimeter Security & Housekeeping Services',
    manpowerCount: 10,
    ratePerManpower: '18000.00',
    paidAmount: '0.00',
    notes: 'Payment due within 15 days of invoice date via NEFT/RTGS.',
  });

  const getClient = (id: number) => safeClients.find((c) => c.id === id);

  const filteredInvoices = safeInvoices.filter((inv) => {
    if (!inv) return false;
    const client = getClient(inv.clientId);
    const search = searchTerm.toLowerCase();
    const invNum = (inv.invoiceNumber || '').toLowerCase();
    const period = (inv.billingPeriod || '').toLowerCase();
    const clientName = (client?.companyName || '').toLowerCase();
    const matchesSearch =
      invNum.includes(search) ||
      clientName.includes(search) ||
      period.includes(search);
    const matchesStatus = filterStatus === 'all' || inv.paymentStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpenCreate = () => {
    setFormData({
      clientId: clients[0]?.id || 1,
      invoiceNumber: `SMSF-INV-${Date.now().toString().slice(-6)}`,
      invoiceDate: new Date().toISOString().split('T')[0],
      billingPeriod: 'September 2026',
      serviceDescription: 'Armed Guarding, Perimeter Security & Housekeeping Services',
      manpowerCount: 10,
      ratePerManpower: '18000.00',
      paidAmount: '0.00',
      notes: 'Payment due within 15 days of invoice date via NEFT/RTGS.',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to generate invoice');
      }

      setModalOpen(false);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Invoice creation error');
    } finally {
      setLoading(false);
    }
  };

  // Live calculation in modal
  const modalSubtotal = Number(formData.manpowerCount || 0) * Number(formData.ratePerManpower || 0);
  const modalGst = modalSubtotal * 0.18;
  const modalTotal = modalSubtotal + modalGst;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Client Invoices & GST Billing</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Generate GST-compliant tax invoices, track payment milestones, and print branded client statements.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create New Invoice
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by invoice #, client, or month..."
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
            <option value="all">All Invoices</option>
            <option value="Paid">Paid</option>
            <option value="Partially Paid">Partially Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Invoice # & Date</th>
                <th className="py-3.5 px-4">Client Enterprise</th>
                <th className="py-3.5 px-4">Billing Period</th>
                <th className="py-3.5 px-4">Staff & Rate</th>
                <th className="py-3.5 px-4">Total Amount (Incl. 18% GST)</th>
                <th className="py-3.5 px-4">Payment Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No invoices found.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const client = getClient(inv.clientId);
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-blue-700">{inv.invoiceNumber}</div>
                        <div className="text-[10px] text-slate-400">{inv.invoiceDate}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{client?.companyName || 'Client ID ' + inv.clientId}</div>
                        <div className="text-[10px] text-slate-500">{client?.clientName}</div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        {inv.billingPeriod}
                      </td>
                      <td className="py-3.5 px-4">
                        <div>{inv.manpowerCount} Staff @ ₹{Number(inv.ratePerManpower).toLocaleString('en-IN')}/ea</div>
                        <div className="text-[10px] text-slate-400">GST: ₹{Number(inv.gstAmount).toLocaleString('en-IN')}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-sm text-slate-900">
                          ₹{Number(inv.totalAmount).toLocaleString('en-IN')}
                        </div>
                        {Number(inv.balanceAmount) > 0 && (
                          <div className="text-[10px] text-amber-700 font-semibold">
                            Bal: ₹{Number(inv.balanceAmount).toLocaleString('en-IN')}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            inv.paymentStatus === 'Paid'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : inv.paymentStatus === 'Partially Paid'
                              ? 'bg-sky-50 text-sky-700 border border-sky-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {inv.paymentStatus === 'Paid' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {inv.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1">
                        <button
                          onClick={() => setViewingInvoice(inv)}
                          title="View Tax Invoice"
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Invoice Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
            <button onClick={() => setModalOpen(false)} className="absolute top-5 right-5 text-slate-400">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Generate GST Tax Invoice</h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Client Enterprise *</label>
                  <select
                    value={formData.clientId}
                    onChange={(e) => setFormData({ ...formData, clientId: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-600"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.companyName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Billing Period *</label>
                  <input
                    type="text"
                    required
                    value={formData.billingPeriod}
                    onChange={(e) => setFormData({ ...formData, billingPeriod: e.target.value })}
                    placeholder="e.g. September 2026"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Service Description</label>
                <input
                  type="text"
                  required
                  value={formData.serviceDescription}
                  onChange={(e) => setFormData({ ...formData, serviceDescription: e.target.value })}
                  placeholder="Security and facility upkeep"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Manpower Count</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.manpowerCount}
                    onChange={(e) => setFormData({ ...formData, manpowerCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rate per Staff (₹)</label>
                  <input
                    type="text"
                    value={formData.ratePerManpower}
                    onChange={(e) => setFormData({ ...formData, ratePerManpower: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Paid Amount (₹)</label>
                  <input
                    type="text"
                    value={formData.paidAmount}
                    onChange={(e) => setFormData({ ...formData, paidAmount: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              {/* Live Computation Preview */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({formData.manpowerCount} Staff):</span>
                  <span className="font-semibold">₹{modalSubtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST @ 18% (CGST 9% + SGST 9%):</span>
                  <span className="font-semibold">₹{modalGst.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 pt-1 border-t text-sm">
                  <span>Total Payable:</span>
                  <span className="text-blue-700">₹{modalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Payment Terms & Notes</label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold"
                >
                  {loading ? 'Generating...' : 'Issue Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Branded View / Print Invoice Modal */}
      {viewingInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 space-y-6 relative my-8">
            <button onClick={() => setViewingInvoice(null)} className="absolute top-5 right-5 text-slate-400">
              <X className="w-5 h-5" />
            </button>

            {/* Invoice Printable Header */}
            <div className="flex items-start justify-between border-b pb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-xl bg-white p-1 shadow border border-blue-200 flex items-center justify-center shrink-0">
                  <CompanyLogo size="md" />
                </div>
                <div>
                  <h3 className="font-black text-xl text-slate-900 leading-tight">
                    STEEL MAN FORCE SECURITY
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Bommana Halli, Bengaluru, Karnataka - 560068 | GSTIN: {settings?.gstNumber || '29AABCS8891P1ZX'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs uppercase tracking-wider font-bold text-blue-600">Tax Invoice</div>
                <div className="font-mono font-black text-slate-900 text-base">{viewingInvoice.invoiceNumber}</div>
                <div className="text-[11px] text-slate-500">{viewingInvoice.invoiceDate}</div>
              </div>
            </div>

            {/* Bill To */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Billed To:</span>
                <div className="font-bold text-slate-900 text-sm">{getClient(viewingInvoice.clientId)?.companyName}</div>
                <div className="text-slate-600">{getClient(viewingInvoice.clientId)?.clientName}</div>
                <div className="text-slate-500">{getClient(viewingInvoice.clientId)?.address}</div>
                <div className="text-slate-600 font-medium">Attn: {getClient(viewingInvoice.clientId)?.contactPerson}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Invoice Summary:</span>
                <div className="text-slate-700">Billing Period: <strong>{viewingInvoice.billingPeriod}</strong></div>
                <div className="text-slate-700">Status: <strong className="text-blue-700">{viewingInvoice.paymentStatus}</strong></div>
                <div className="text-slate-700">Payment Due: <strong>15 Days Net</strong></div>
              </div>
            </div>

            {/* Line Items */}
            <div className="border rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b">
                  <tr>
                    <th className="p-2.5">Description</th>
                    <th className="p-2.5 text-center">Qty / Guards</th>
                    <th className="p-2.5 text-right">Rate (₹)</th>
                    <th className="p-2.5 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="p-2.5">
                      <div className="font-semibold text-slate-800">{viewingInvoice.serviceDescription}</div>
                      <div className="text-[10px] text-slate-400">Monthly deployment & supervisory audits</div>
                    </td>
                    <td className="p-2.5 text-center font-bold">{viewingInvoice.manpowerCount}</td>
                    <td className="p-2.5 text-right">₹{Number(viewingInvoice.ratePerManpower).toLocaleString('en-IN')}</td>
                    <td className="p-2.5 text-right font-bold">₹{Number(viewingInvoice.amount).toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end text-xs">
              <div className="w-64 space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold">₹{Number(viewingInvoice.amount).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>CGST (9.0%):</span>
                  <span>₹{(Number(viewingInvoice.gstAmount) / 2).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>SGST (9.0%):</span>
                  <span>₹{(Number(viewingInvoice.gstAmount) / 2).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t">
                  <span>Total Amount:</span>
                  <span className="text-blue-700">₹{Number(viewingInvoice.totalAmount).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs text-emerald-700">
                  <span>Paid:</span>
                  <span>-₹{Number(viewingInvoice.paidAmount).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-bold text-rose-700 pt-1 border-t">
                  <span>Balance Due:</span>
                  <span>₹{Number(viewingInvoice.balanceAmount).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Bank details for transfer */}
            <div className="p-3 bg-slate-50 rounded-xl border text-[11px] text-slate-600 space-y-1">
              <span className="font-bold text-slate-800">Bank Transfer Details:</span>
              <div>Bank: {settings?.bankName || 'State Bank of India'} | A/C: {settings?.bankAccount || '39088472910'}</div>
              <div>IFSC: {settings?.bankIfsc || 'SBIN0004512'} | Branch: {settings?.bankBranch || 'Bommanahalli, Bengaluru'}</div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" /> Print Tax Invoice
              </button>
              <button
                onClick={() => setViewingInvoice(null)}
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
