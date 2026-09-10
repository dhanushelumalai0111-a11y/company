import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  MapPin,
  X,
  Save,
  Users
} from 'lucide-react';
import { ClientItem } from '../../types.ts';

interface ClientManagementProps {
  clients: ClientItem[];
  onRefresh: () => void;
}

export const ClientManagement: React.FC<ClientManagementProps> = ({
  clients = [],
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientItem | null>(null);
  const [viewingClient, setViewingClient] = useState<ClientItem | null>(null);
  const [loading, setLoading] = useState(false);

  const safeClients = Array.isArray(clients) ? clients : [];

  const [formData, setFormData] = useState({
    clientName: '',
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    serviceProvided: 'Security Guard Services',
    employeesDeployed: 5,
    contractStartDate: new Date().toISOString().split('T')[0],
    contractEndDate: '2027-12-31',
    monthlyContractAmount: '90000.00',
    status: 'Active' as 'Active' | 'Inactive',
    notes: '',
    showOnWebsite: true,
  });

  const filteredClients = safeClients.filter((c) => {
    if (!c) return false;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (c.companyName || '').toLowerCase().includes(term) ||
      (c.clientName || '').toLowerCase().includes(term) ||
      (c.contactPerson || '').toLowerCase().includes(term) ||
      (c.serviceProvided || '').toLowerCase().includes(term);
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpenCreate = () => {
    setEditingClient(null);
    setFormData({
      clientName: '',
      companyName: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      serviceProvided: 'Security Guard Services',
      employeesDeployed: 5,
      contractStartDate: new Date().toISOString().split('T')[0],
      contractEndDate: '2027-12-31',
      monthlyContractAmount: '90000.00',
      status: 'Active',
      notes: '',
      showOnWebsite: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (client: ClientItem) => {
    setEditingClient(client);
    setFormData({
      clientName: client.clientName,
      companyName: client.companyName,
      contactPerson: client.contactPerson,
      phone: client.phone,
      email: client.email,
      address: client.address,
      serviceProvided: client.serviceProvided,
      employeesDeployed: client.employeesDeployed,
      contractStartDate: client.contractStartDate,
      contractEndDate: client.contractEndDate,
      monthlyContractAmount: client.monthlyContractAmount,
      status: client.status,
      notes: client.notes || '',
      showOnWebsite: client.showOnWebsite ?? true,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to remove this client?')) return;
    try {
      const res = await fetch(`/api/clients/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Failed to delete client');
        return;
      }
      onRefresh();
    } catch (e) {
      alert('Error deleting client');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingClient ? `/api/clients/${editingClient.id}` : '/api/clients';
      const method = editingClient ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save client');
      }

      setModalOpen(false);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Save error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Client Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage corporate client contracts, manpower allocation, monthly billing, and contact details.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add New Client
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by company, client, or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none"
          >
            <option value="all">All Clients ({clients.length})</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Company & Site</th>
                <th className="py-3.5 px-4">Contact Person</th>
                <th className="py-3.5 px-4">Service Provided</th>
                <th className="py-3.5 px-4">Staff Deployed</th>
                <th className="py-3.5 px-4">Monthly Bill</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No clients found matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">{client.companyName}</div>
                      <div className="text-[11px] text-slate-500">{client.clientName}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-xs">{client.address}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{client.contactPerson}</div>
                      <div className="text-[11px] text-slate-500">{client.phone}</div>
                      <div className="text-[11px] text-blue-600 truncate max-w-xs">{client.email}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {client.serviceProvided}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-md">
                        <Users className="w-3 h-3" />
                        {client.employeesDeployed} Guards
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      ₹{Number(client.monthlyContractAmount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          client.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-300'
                        }`}
                      >
                        {client.status === 'Active' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {client.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => setViewingClient(client)}
                        title="View Details"
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(client)}
                        title="Edit Client"
                        className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-slate-100 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(client.id)}
                        title="Delete Client"
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

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-4">
              {editingClient ? 'Edit Client Record' : 'Register New Client Contract'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Company / Enterprise Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="e.g. Infosys BPM Logistics"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Premises / Site Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="e.g. Bommanahalli Hub"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Person *</label>
                  <input
                    type="text"
                    required
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="e.g. Mr. Karthik Sen"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 97410 45678"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="operations@company.com"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Site Address in Bengaluru *</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street, Area, Bengaluru PIN Code"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Service Provided</label>
                  <input
                    type="text"
                    value={formData.serviceProvided}
                    onChange={(e) => setFormData({ ...formData, serviceProvided: e.target.value })}
                    placeholder="e.g. Armed Security & Housekeeping"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Staff Deployed Count</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.employeesDeployed}
                    onChange={(e) => setFormData({ ...formData, employeesDeployed: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Monthly Billing (₹)</label>
                  <input
                    type="text"
                    value={formData.monthlyContractAmount}
                    onChange={(e) => setFormData({ ...formData, monthlyContractAmount: e.target.value })}
                    placeholder="90000.00"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contract Start Date</label>
                  <input
                    type="date"
                    value={formData.contractStartDate}
                    onChange={(e) => setFormData({ ...formData, contractStartDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contract End Date</label>
                  <input
                    type="date"
                    value={formData.contractEndDate}
                    onChange={(e) => setFormData({ ...formData, contractEndDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contract Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Operational Notes / SLA</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Gate numbers, supervisor mobile, night patrol rounds..."
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="showOnWebsite"
                  checked={formData.showOnWebsite}
                  onChange={(e) => setFormData({ ...formData, showOnWebsite: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="showOnWebsite" className="text-slate-700 font-medium">
                  Display this client in website showcase partners section
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Saving...' : 'Save Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewingClient && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-lg text-slate-900">{viewingClient.companyName}</h3>
                <p className="text-xs text-blue-600">{viewingClient.clientName}</p>
              </div>
              <button onClick={() => setViewingClient(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div>
                <strong className="text-slate-800">Contact Person:</strong> {viewingClient.contactPerson} ({viewingClient.phone})
              </div>
              <div>
                <strong className="text-slate-800">Email:</strong> {viewingClient.email}
              </div>
              <div>
                <strong className="text-slate-800">Site Location:</strong> {viewingClient.address}
              </div>
              <div>
                <strong className="text-slate-800">Service:</strong> {viewingClient.serviceProvided}
              </div>
              <div>
                <strong className="text-slate-800">Manpower Deployed:</strong> {viewingClient.employeesDeployed} Guards
              </div>
              <div>
                <strong className="text-slate-800">Contract Term:</strong> {viewingClient.contractStartDate} to {viewingClient.contractEndDate}
              </div>
              <div>
                <strong className="text-slate-800">Monthly Contract Value:</strong> ₹{Number(viewingClient.monthlyContractAmount).toLocaleString('en-IN')}
              </div>
              {viewingClient.notes && (
                <div className="p-2.5 bg-slate-50 rounded border text-slate-700 italic">
                  "{viewingClient.notes}"
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewingClient(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold"
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
