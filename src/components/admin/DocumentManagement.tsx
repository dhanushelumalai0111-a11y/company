import React, { useState } from 'react';
import {
  FolderOpen,
  Plus,
  Search,
  FileText,
  ShieldCheck,
  Building,
  User,
  Trash2,
  Download,
  X,
  ExternalLink
} from 'lucide-react';
import { DocumentItem, EmployeeItem, ClientItem } from '../../types.ts';

interface DocumentManagementProps {
  documents: DocumentItem[];
  employees: EmployeeItem[];
  clients: ClientItem[];
  onRefresh: () => void;
}

export const DocumentManagement: React.FC<DocumentManagementProps> = ({
  documents = [],
  employees = [],
  clients = [],
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);

  const safeDocs = Array.isArray(documents) ? documents : [];
  const safeEmployees = Array.isArray(employees) ? employees : [];
  const safeClients = Array.isArray(clients) ? clients : [];

  const [formData, setFormData] = useState({
    title: '',
    documentType: 'Police Verification' as 'Police Verification' | 'ID Proof' | 'Contract' | 'License' | 'Training Certificate',
    relatedType: 'Employee' as 'Employee' | 'Client' | 'Company',
    relatedId: safeEmployees[0]?.id || 1,
    fileUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=500',
    expiryDate: '2028-12-31',
    status: 'Valid' as 'Valid' | 'Expired' | 'Pending Review',
  });

  const filteredDocs = safeDocs.filter((d) => {
    if (!d) return false;
    const search = searchTerm.toLowerCase();
    const title = (d.title || '').toLowerCase();
    const docType = (d.documentType || '').toLowerCase();
    const matchesSearch = title.includes(search) || docType.includes(search);
    const matchesType = filterType === 'all' || d.documentType === filterType;
    return matchesSearch && matchesType;
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setModalOpen(false);
        onRefresh();
      }
    } catch (e) {
      alert('Error creating document record');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    try {
      const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      if (res.ok) onRefresh();
    } catch (e) {
      alert('Error deleting document');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Compliance & Document Vault</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            PSARA licenses, armed gunman weapon permits, police verification forms, and signed client SLAs.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Archive New Document
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search documents by title or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
          >
            <option value="all">All Document Categories ({documents.length})</option>
            <option value="Police Verification">Police Verification</option>
            <option value="License">License & Weapon Permit</option>
            <option value="Contract">Client Service Contract</option>
            <option value="ID Proof">Aadhaar / ID Proof</option>
            <option value="Training Certificate">Training Certificate</option>
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
            No compliance documents found.
          </div>
        ) : (
          filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-300 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      doc.status === 'Valid'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 leading-tight">{doc.title}</h3>
                <div className="text-[11px] text-slate-500 space-y-0.5">
                  <div>Type: <strong className="text-slate-700">{doc.documentType}</strong></div>
                  <div>Entity: <strong className="text-slate-700">{doc.relatedType} #{doc.relatedId || 'Company'}</strong></div>
                  {doc.expiryDate && (
                    <div>Valid Until: <strong className="text-blue-700">{doc.expiryDate}</strong></div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t flex items-center justify-between">
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> View File
                </a>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-slate-400">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Archive Document</h3>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Armed Gunman Arms License Renewed"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.documentType}
                    onChange={(e) => setFormData({ ...formData, documentType: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="Police Verification">Police Verification</option>
                    <option value="License">License / Gun Permit</option>
                    <option value="Contract">Client Service SLA</option>
                    <option value="ID Proof">Aadhaar / ID Proof</option>
                    <option value="Training Certificate">Training Certificate</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Associated With</label>
                  <select
                    value={formData.relatedType}
                    onChange={(e) => setFormData({ ...formData, relatedType: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="Employee">Security Personnel</option>
                    <option value="Client">Client Enterprise</option>
                    <option value="Company">Company Master</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Document File URL</label>
                <input
                  type="text"
                  required
                  value={formData.fileUrl}
                  onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="Valid">Valid</option>
                    <option value="Pending Review">Pending Review</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
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
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
