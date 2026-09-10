import React, { useState } from 'react';
import {
  Settings,
  Building2,
  Phone,
  Mail,
  MapPin,
  Shield,
  CreditCard,
  Save,
  CheckCircle
} from 'lucide-react';
import { CompanySettings } from '../../types.ts';

interface SettingsManagementProps {
  settings?: CompanySettings;
  onRefresh: () => void;
}

export const SettingsManagement: React.FC<SettingsManagementProps> = ({
  settings,
  onRefresh,
}) => {
  const [formData, setFormData] = useState<CompanySettings>({
    companyName: settings?.companyName || 'Steel Men Security Force',
    tagline: settings?.tagline || 'Premier Security, Guarding & Facility Management Services',
    phone: settings?.phone || '+91 98450 12345',
    email: settings?.email || 'info@steelmensecurityforce.com',
    emergencyPhone: settings?.emergencyPhone || '+91 98450 99999',
    address: settings?.address || 'Near Oxford College, Bommana Halli, Hosur Main Road, Bengaluru, Karnataka, India - 560068',
    psaraLicenseNo: settings?.psaraLicenseNo || 'KA/BLR/PSARA/2021/4982',
    gstNumber: settings?.gstNumber || '29AABCS8891P1ZX',
    panNumber: settings?.panNumber || 'AABCS8891P',
    bankName: settings?.bankName || 'State Bank of India',
    bankAccount: settings?.bankAccount || '39088472910',
    bankIfsc: settings?.bankIfsc || 'SBIN0004512',
    bankBranch: settings?.bankBranch || 'Bommanahalli, Bengaluru',
    enableGst: settings?.enableGst ?? true,
    defaultGstRate: settings?.defaultGstRate || '18.00',
  });

  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSavedSuccess(false);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save settings');
      }

      setSavedSuccess(true);
      onRefresh();
    } catch (e: any) {
      alert(e.message || 'Error saving settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Enterprise & Statutory Settings</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Master company profile, PSARA security compliance accreditation, tax configuration, and banking details.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          Settings updated successfully! Changes are reflected across invoices, payslips, and public branding.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Company Identity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm border-b pb-3">
            <Building2 className="w-4 h-4 text-blue-600" />
            Company Identity & Location
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Company Registered Name *</label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Corporate Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Corporate Office & Headquarter Address *</label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Mobile / Phone *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">24/7 Emergency Control Room Phone</label>
              <input
                type="text"
                value={formData.emergencyPhone}
                onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Statutory & PSARA Compliance */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm border-b pb-3">
            <Shield className="w-4 h-4 text-blue-600" />
            Statutory & PSARA Compliance
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">PSARA License No. *</label>
              <input
                type="text"
                required
                value={formData.psaraLicenseNo}
                onChange={(e) => setFormData({ ...formData, psaraLicenseNo: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">GSTIN *</label>
              <input
                type="text"
                required
                value={formData.gstNumber}
                onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg font-mono uppercase"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Permanent Account Number (PAN)</label>
              <input
                type="text"
                value={formData.panNumber}
                onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg font-mono uppercase"
              />
            </div>
          </div>
        </div>

        {/* Banking Details */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm border-b pb-3">
            <CreditCard className="w-4 h-4 text-blue-600" />
            Official Settlement Bank Account
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Bank Name</label>
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Current Account Number</label>
              <input
                type="text"
                value={formData.bankAccount}
                onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">IFSC Code</label>
              <input
                type="text"
                value={formData.bankIfsc}
                onChange={(e) => setFormData({ ...formData, bankIfsc: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg font-mono uppercase"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Branch Name</label>
              <input
                type="text"
                value={formData.bankBranch}
                onChange={(e) => setFormData({ ...formData, bankBranch: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold rounded-xl shadow transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Updating Enterprise Records...' : 'Save Enterprise Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};
